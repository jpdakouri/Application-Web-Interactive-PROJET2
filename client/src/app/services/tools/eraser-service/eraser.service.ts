import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EraserCommand } from '@app/classes/tool-commands/eraser-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MIN_ERASER_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    private undoRedo: UndoRedoService;
    private commandPaths: Vec2[][];

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService, undoRedo: UndoRedoService) {
        super(drawingService, currentColourService);
        this.clearPath();
        this.lineThickness = MIN_ERASER_THICKNESS;
        this.undoRedo = undoRedo;
        this.commandPaths = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.commandPaths = [];
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData, this.lineThickness || MIN_ERASER_THICKNESS);
            this.commandPaths.push(this.pathData);
            const command = new EraserCommand(this, this.lineThickness || MIN_ERASER_THICKNESS, this.commandPaths);
            this.undoRedo.addCommand(command);
        }
        this.clearPath();
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        this.eraserActive = true;
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData, this.lineThickness || MIN_ERASER_THICKNESS);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.eraserActive = false;
        if (this.mouseDown) {
            this.pathData.push(this.getPositionFromMouse(event));
            this.commandPaths.push(this.pathData);
            this.erase(this.drawingService.baseCtx, this.pathData, this.lineThickness || MIN_ERASER_THICKNESS);
            this.clearPath();
            this.drawingService.previewCtx.beginPath();
        }
    }

    private erase(ctx: CanvasRenderingContext2D, path: Vec2[], eraserSize: number): void {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = eraserSize;
        ctx.lineCap = 'square';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    executeCommand(command: EraserCommand): void {
        command.strokePaths.forEach((path) => {
            this.erase(this.drawingService.baseCtx, path, command.strokeThickness);
        });
    }
}
