import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ShapeCommand } from '@app/classes/tool-commands/shape-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ShapeStyle } from '@app/utils/enums/shape-style';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;
    currentColorService: CurrentColorService;
    private undoRedo: UndoRedoService;
    private mousePositionHandler: MousePositionHandlerService;

    constructor(
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        undoRedo: UndoRedoService,
        mousePositionHandler: MousePositionHandlerService,
    ) {
        super(drawingService, currentColorService);
        this.currentColorService = currentColorService;
        this.undoRedo = undoRedo;
        this.mousePositionHandler = mousePositionHandler;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
            this.updatePreview();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(
                this.drawingService.previewCtx,
                this.firstGrid,
                this.mouseDownCoord,
                this.currentColorService.getPrimaryColorRgba(),
                this.currentColorService.getSecondaryColorRgba(),
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                this.shapeStyle,
            );
            if (this.shiftDown) {
                this.mousePositionHandler.makeSquare(this.mouseDownCoord, this.mouseDownCoord);
            }
            this.drawRectangle(
                this.drawingService.baseCtx,
                this.firstGrid,
                this.mouseDownCoord,
                this.currentColorService.getPrimaryColorRgba(),
                this.currentColorService.getSecondaryColorRgba(),
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                this.shapeStyle,
            );
            const command = new ShapeCommand(
                this,
                this.currentColorService.getPrimaryColorRgba(),
                this.currentColorService.getSecondaryColorRgba(),
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                this.firstGrid,
                this.mouseDownCoord,
                this.shapeStyle,
            );
            this.undoRedo.addCommand(command);
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Escape) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
        }
        if (event.key === KeyboardButtons.Shift) {
            this.shiftDown = true;
            this.updatePreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && event.key === KeyboardButtons.Shift) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = this.currentColorService.getSecondaryColorRgba();

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

    drawOutline(ctx: CanvasRenderingContext2D, firstGrid: Vec2, finalGrid: Vec2, thickness: number, secondaryColor: string): void {
        ctx.beginPath();
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = thickness;
        ctx.strokeRect(firstGrid.x, firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilled(ctx: CanvasRenderingContext2D, firstGrid: Vec2, finalGrid: Vec2, primaryColor: string): void {
        ctx.beginPath();
        ctx.fillStyle = primaryColor;
        ctx.fillRect(firstGrid.x, firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilledOutline(
        ctx: CanvasRenderingContext2D,
        firstGrid: Vec2,
        finalGrid: Vec2,
        thickness: number,
        primaryColor: string,
        secondaryColor: string,
    ): void {
        ctx.beginPath();
        ctx.fillStyle = primaryColor;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = secondaryColor;
        ctx.strokeRect(firstGrid.x, firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.fillRect(firstGrid.x, firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private drawRectangle(
        ctx: CanvasRenderingContext2D,
        firstGrid: Vec2,
        finalGrid: Vec2,
        primaryColor: string,
        secondaryColor: string,
        strokeThickness: number,
        shapeStyle?: ShapeStyle,
    ): void {
        switch (shapeStyle) {
            case ShapeStyle.Outline:
                this.drawOutline(ctx, firstGrid, finalGrid, strokeThickness, secondaryColor);
                break;

            case ShapeStyle.Filled:
                this.drawFilled(ctx, firstGrid, finalGrid, primaryColor);
                break;

            case ShapeStyle.FilledOutline:
                this.drawFilledOutline(ctx, firstGrid, finalGrid, strokeThickness, primaryColor, secondaryColor);
                break;

            default:
                this.drawOutline(ctx, finalGrid, finalGrid, strokeThickness, secondaryColor);
                break;
        }
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        this.drawPerimeter(this.drawingService.previewCtx, currentCoord);
        if (this.shiftDown) {
            this.mousePositionHandler.makeSquare(this.mouseDownCoord, currentCoord);
        }
        this.drawRectangle(
            this.drawingService.previewCtx,
            this.firstGrid,
            currentCoord,
            this.currentColorService.getPrimaryColorRgba(),
            this.currentColorService.getSecondaryColorRgba(),
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            this.shapeStyle,
        );
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    executeCommand(command: ShapeCommand): void {
        this.drawRectangle(
            this.drawingService.baseCtx,
            command.initialPosition,
            command.finalPosition,
            command.primaryColor,
            command.secondaryColor,
            command.strokeThickness,
            command.shapeStyle,
        );
    }
}
