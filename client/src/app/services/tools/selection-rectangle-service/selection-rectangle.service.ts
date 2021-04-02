import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SelectionCommand } from '@app/classes/tool-commands/selection-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_POS, BLUE_POS, GREEN_POS, MAX_BYTE_VALUE, RED_POS } from '@app/services/services-constants';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Sign } from '@app/utils/enums/rgb-settings';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        private undoRedo: UndoRedoService,
    ) {
        super(drawingService, currentColorService, mousePositionHandler, undoRedo);
        this.currentColorService = currentColorService;
        this.topLeftCorner = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.selectionActive = this.dragActive = false;
        this.drawingService.selectedAreaCtx = this.drawingService.baseCtx;
        this.mousePositionHandler = mousePositionHandler;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        this.firstGrid = this.getPositionFromMouse(event);
        this.mouseMoved = false;
        if (this.mouseDown) {
            if (!this.selectionActive) {
                this.drawingService.clearCanvas(this.drawingService.selectedAreaCtx);
                this.firstGridClip = this.getPositionFromMouse(event);
                this.updatePreview();
                this.selectionActive = true;
            } else {
                if (this.isClickIn(this.firstGrid)) {
                    const initial = this.getPositionFromMouse(event);
                    this.offset.x = this.topLeftCorner.x - initial.x;
                    this.offset.y = this.topLeftCorner.y - initial.y;
                    this.dragActive = true;
                } else {
                    this.selectionActive = false;
                    const imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
                    createImageBitmap(imageData).then((imgBitmap) => {
                        this.drawingService.baseCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
                    });
                    this.drawingService.selectedAreaCtx.canvas.width = this.drawingService.selectedAreaCtx.canvas.height = 0;
                    this.isSelectionDone = false;
                    const command = new SelectionCommand(
                        this,
                        this.initialTopLeftCorner,
                        { ...this.topLeftCorner },
                        { x: this.width, y: this.height },
                        imageData,
                    );
                    this.undoRedo.addCommand(command);
                }
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.selectionActive && !this.dragActive) {
            this.mouseMoved = true;
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();
        } else if (this.mouseDown && this.selectionActive && this.dragActive) {
            this.updateDragPosition(this.getPositionFromMouse(event));
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && this.selectionActive && !this.dragActive && this.mouseMoved) {
            this.isSelectionDone = true;

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.finalGridClip = this.getPositionFromMouse(event);
            this.updateTopLeftCorner();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.shiftDown) {
                this.mousePositionHandler.makeSquare(this.mouseDownCoord, this.mouseDownCoord);
            }
            this.initialTopLeftCorner = { ...this.topLeftCorner };
            this.selectionRectangle(this.drawingService.selectedAreaCtx, this.mouseDownCoord);
        }
        this.mouseDown = this.dragActive = this.mouseMoved = false;
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;

        const startCoord = { ...this.firstGrid };
        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);

        if (finalGrid.x < 0) {
            startCoord.x += finalGrid.x;
        }
        if (finalGrid.y < 0) {
            startCoord.y += finalGrid.y;
        }
        ctx.strokeRect(startCoord.x, startCoord.y, width, height);
    }

    private selectionRectangle(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        // Take a pixel region
        this.drawingService.clearCanvas(ctx);
        const imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        const bottomRightCorner: Vec2 = { x: imageData.width, y: imageData.height };

        // Replace all empty pixels with white ones
        for (let i = 3; i < imageData.data.length; i += ALPHA_POS) {
            if (imageData.data[i] === 0) {
                imageData.data[i - RED_POS] = MAX_BYTE_VALUE;
                imageData.data[i - GREEN_POS] = MAX_BYTE_VALUE;
                imageData.data[i - BLUE_POS] = MAX_BYTE_VALUE;
                imageData.data[i] = MAX_BYTE_VALUE;
            }
        }
        createImageBitmap(imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
        });
        this.height = imageData.height;
        this.width = imageData.width;
        // Resize selectedAreaCtx
        ctx.canvas.width = bottomRightCorner.x;
        ctx.canvas.height = bottomRightCorner.y;
        // Move the result of the selection
        ctx.translate(-this.topLeftCorner.x, -this.topLeftCorner.y);
        // Replace the selection at the position of the mouse
        ctx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        ctx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
        // Create a white backround
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        if (this.shiftDown) {
            this.mousePositionHandler.makeSquare(this.mouseDownCoord, currentCoord);
        }
        this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    selectAll(): void {
        this.clearPath();
        this.drawingService.selectedAreaCtx.canvas.style.top = Sign.Negative + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = Sign.Negative + 'px';
        const grid: Vec2 = { x: this.drawingService.baseCtx.canvas.width, y: this.drawingService.baseCtx.canvas.height };
        this.selectionRectangle(this.drawingService.selectedAreaCtx, grid);
        this.selectionActive = true;
    }

    executeCommand(command: SelectionCommand): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(command.initialTopLeftCorner.x, command.initialTopLeftCorner.y, this.width, this.height);
        const imageData = command.imageData;
        createImageBitmap(imageData).then((imgBitmap) => {
            this.drawingService.baseCtx.drawImage(imgBitmap, command.finalTopLeftCorner.x, command.finalTopLeftCorner.y);
        });
    }
}
