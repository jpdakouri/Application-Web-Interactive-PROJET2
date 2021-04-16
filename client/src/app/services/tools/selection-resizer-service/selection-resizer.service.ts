import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

const REVERT = -1;
@Injectable({
    providedIn: 'root',
})
export class SelectionResizerService extends SelectionService {
    status: SelectionStatus;
    private mouseService: MouseHandlerService;
    private selectionMouseDown: boolean = false;
    imageData: ImageData;
    private coords: Vec2;
    private initialBottomRightCorner: Vec2;
    private revertX: boolean;
    private revertY: boolean;
    private mousePositionHandler: MousePositionHandlerService;
    constructor(
        mouseService: MouseHandlerService,
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        private undoRedo: UndoRedoService,
    ) {
        super(drawingService, currentColorService);
        this.status = SelectionStatus.OFF;
        this.mouseService = mouseService;
        this.mousePositionHandler = mousePositionHandler;
        this.coords = { x: 0, y: 0 };
        this.initialBottomRightCorner = { x: 0, y: 0 };
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseService.onMouseDown(this.mouseService.eventToCoordinate(event));
        this.selectionMouseDown = true;
        this.mouseDownCoord = this.coords = this.getPositionFromMouse(event);
        // LIGNE SUIVANTE A CHANGER, JUSTE LA POUR REGLER UN PROBLEME DE COMPILATION !!!
        this.undoRedo = this.undoRedo;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseService.onMouseUp(this.mouseService.eventToCoordinate(event));
        this.selectionMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.selectionMouseDown) {
            this.mouseService.onMouseMove(this.mouseService.eventToCoordinate(event));
            const currentCoord = (this.coords = this.getPositionFromMouse(event));
            this.offset.x = this.mouseDownCoord.x - currentCoord.x;
            this.offset.y = this.mouseDownCoord.y - currentCoord.y;
            if (this.isResizing()) {
                this.resizeSelection();
            }
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Shift) {
            this.shiftDown = true;
            this.updatePreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Shift) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    isResizing(): boolean {
        return this.status !== SelectionStatus.OFF;
    }

    setStatus(status: SelectionStatus): void {
        this.status = status;
        this.initialize();
    }

    private resizeSelection(): void {
        if (this.initialTopLeftCorner === undefined) return;
        switch (this.status) {
            case SelectionStatus.TOP_LEFT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width + this.offset.x;
                this.topLeftCorner.x = this.initialTopLeftCorner.x - this.offset.x;
                this.drawingService.selectedAreaCtx.canvas.height = this.height + this.offset.y;
                this.topLeftCorner.y = this.initialTopLeftCorner.y - this.offset.y;
                break;
            case SelectionStatus.TOP_MIDDLE_BOX:
                this.drawingService.selectedAreaCtx.canvas.height = this.height + this.offset.y;
                this.topLeftCorner.y = this.initialTopLeftCorner.y - this.offset.y;
                break;
            case SelectionStatus.TOP_RIGHT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width - this.offset.x;
                this.drawingService.selectedAreaCtx.canvas.height = this.height + this.offset.y;
                this.topLeftCorner.y = this.initialTopLeftCorner.y - this.offset.y;
                break;
            case SelectionStatus.MIDDLE_RIGHT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width - this.offset.x;
                break;
            case SelectionStatus.BOTTOM_RIGHT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width - this.offset.x;
                this.drawingService.selectedAreaCtx.canvas.height = this.height - this.offset.y;
                break;
            case SelectionStatus.BOTTOM_MIDDLE_BOX:
                this.drawingService.selectedAreaCtx.canvas.height = this.height - this.offset.y;
                break;
            case SelectionStatus.BOTTOM_LEFT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width + this.offset.x;
                this.topLeftCorner.x = this.initialTopLeftCorner.x - this.offset.x;
                this.drawingService.selectedAreaCtx.canvas.height = this.height - this.offset.y;
                break;
            case SelectionStatus.MIDDLE_LEFT_BOX:
                this.drawingService.selectedAreaCtx.canvas.width = this.width + this.offset.x;
                this.topLeftCorner.x = this.initialTopLeftCorner.x - this.offset.x;
                break;
        }
        this.updatePreview();
    }

    private initialize(): void {
        this.width = this.drawingService.selectedAreaCtx.canvas.width;
        this.height = this.drawingService.selectedAreaCtx.canvas.height;
        this.topLeftCorner.x = this.drawingService.selectedAreaCtx.canvas.offsetLeft;
        this.topLeftCorner.y = this.drawingService.selectedAreaCtx.canvas.offsetTop;
        this.initialTopLeftCorner = { ...this.topLeftCorner };
        this.initialBottomRightCorner.x = this.topLeftCorner.x + this.width;
        this.initialBottomRightCorner.y = this.topLeftCorner.y + this.height;
        this.imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
        this.revertX = this.revertY = false;
    }

    updatePreview(): void {
        this.isMirror();
        this.isSelectionNull();
        this.isSquare();
        this.drawingService.clearCanvas(this.drawingService.selectedAreaCtx);
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y + 'px';
        createImageBitmap(this.imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.scale(this.revertX ? REVERT : 1, this.revertY ? REVERT : 1);
            this.drawingService.selectedAreaCtx.drawImage(
                imgBitmap,
                this.revertX ? -this.drawingService.selectedAreaCtx.canvas.width : 0,
                this.revertY ? -this.drawingService.selectedAreaCtx.canvas.height : 0,
                this.drawingService.selectedAreaCtx.canvas.width,
                this.drawingService.selectedAreaCtx.canvas.height,
            );
            this.drawingService.selectedAreaCtx.setTransform(1, 0, 0, 1, 0, 0);
        });
    }

    private isSelectionNull(): void {
        if (this.width === -this.offset.x || this.height === -this.offset.y || this.width === this.offset.x || this.height === this.offset.y) {
            SelectionService.selectionActive = false;
        } else SelectionService.selectionActive = true;
    }

    private isMirror(): void {
        switch (this.status) {
            case SelectionStatus.TOP_LEFT_BOX:
                this.isMirrorRight();
                this.isMirrorBottom();
                break;
            case SelectionStatus.TOP_MIDDLE_BOX:
                this.isMirrorBottom();
                break;
            case SelectionStatus.TOP_RIGHT_BOX:
                this.isMirrorLeft();
                this.isMirrorBottom();
                break;
            case SelectionStatus.MIDDLE_RIGHT_BOX:
                this.isMirrorLeft();
                break;
            case SelectionStatus.BOTTOM_RIGHT_BOX:
                this.isMirrorLeft();
                this.isMirrorTop();
                break;
            case SelectionStatus.BOTTOM_MIDDLE_BOX:
                this.isMirrorTop();
                break;
            case SelectionStatus.BOTTOM_LEFT_BOX:
                this.isMirrorRight();
                this.isMirrorTop();
                break;
            case SelectionStatus.MIDDLE_LEFT_BOX:
                this.isMirrorRight();
                break;
        }
    }

    private isMirrorTop(): void {
        if (this.initialTopLeftCorner === undefined) return;
        if (this.coords.y < this.initialTopLeftCorner.y) {
            this.topLeftCorner.y = this.coords.y;
            this.drawingService.selectedAreaCtx.canvas.height = Math.abs(this.height - this.offset.y);
            this.revertY = true;
        } else this.revertY = false;
    }

    private isMirrorBottom(): void {
        if (this.coords.y > this.initialBottomRightCorner.y) {
            this.topLeftCorner.y = this.initialBottomRightCorner.y;
            this.drawingService.selectedAreaCtx.canvas.height = Math.abs(this.height + this.offset.y);
            this.revertY = true;
        } else this.revertY = false;
    }

    private isMirrorLeft(): void {
        if (this.initialTopLeftCorner === undefined) return;
        if (this.coords.x < this.initialTopLeftCorner.x) {
            this.topLeftCorner.x = this.coords.x;
            this.drawingService.selectedAreaCtx.canvas.width = Math.abs(this.width - this.offset.x);
            this.revertX = true;
        } else this.revertX = false;
    }

    private isMirrorRight(): void {
        if (this.coords.x > this.initialBottomRightCorner.x) {
            this.topLeftCorner.x = this.initialBottomRightCorner.x;
            this.drawingService.selectedAreaCtx.canvas.width = Math.abs(this.width + this.offset.x);
            this.revertX = true;
        } else this.revertX = false;
    }

    private isSquare(): void {
        if (this.shiftDown) {
            switch (this.status) {
                case SelectionStatus.TOP_LEFT_BOX:
                    this.mousePositionHandler.makeSquare(this.initialBottomRightCorner, this.topLeftCorner);
                    break;
                case SelectionStatus.TOP_RIGHT_BOX:
                    break;
                case SelectionStatus.BOTTOM_RIGHT_BOX:
                    break;
                case SelectionStatus.BOTTOM_LEFT_BOX:
                    break;
            }
        }
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
