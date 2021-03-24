import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilCommand } from '@app/classes/tool-commands/pencil-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];
    private commandPathData: Vec2[][];
    private radius: number;
    private undoRedo: UndoRedoService;
    currentColorService: CurrentColorService;

    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, undoRedo: UndoRedoService) {
        super(drawingService, currentColorService);
        this.currentColorService = currentColorService;
        this.radius = DEFAULT_MIN_THICKNESS;
        this.clearPath();
        this.undoRedo = undoRedo;
        this.commandPathData = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        this.mouseMoved = false;
        if (this.mouseDown) {
            this.clearPath();
            this.commandPathData = [];
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.commandPathData.push(this.pathData);
            const commandLineThickness = this.lineThickness === undefined ? DEFAULT_MIN_THICKNESS : this.lineThickness;
            this.undoRedo.addCommand(
                new PencilCommand(this, this.currentColorService.getPrimaryColorRgba(), commandLineThickness, this.commandPathData),
            );

            if (!this.mouseMoved) {
                this.drawDot(
                    this.drawingService.baseCtx,
                    this.pathData[0],
                    this.lineThickness || DEFAULT_MIN_THICKNESS,
                    this.currentColorService.getPrimaryColorRgba(),
                    this.currentColorService.getPrimaryColorRgba(),
                );
            } else {
                this.drawLine(
                    this.drawingService.baseCtx,
                    this.pathData,
                    this.lineThickness || DEFAULT_MIN_THICKNESS,
                    this.currentColorService.getPrimaryColorRgba(),
                    this.currentColorService.getPrimaryColorRgba(),
                );
            }
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.mouseMoved = true;
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(
                this.drawingService.previewCtx,
                this.pathData,
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                this.currentColorService.getPrimaryColorRgba(),
                this.currentColorService.getPrimaryColorRgba(),
            );
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.commandPathData.push(this.pathData);
            this.drawLine(
                this.drawingService.baseCtx,
                this.pathData,
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                this.currentColorService.getPrimaryColorRgba(),
                this.currentColorService.getPrimaryColorRgba(),
            );
            this.clearPath();
            this.drawingService.previewCtx.beginPath();
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lineWidth: number, strokeStyle: string, fillStyle: string): void {
        this.setContextParameters(ctx, lineWidth, strokeStyle, fillStyle);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawDot(ctx: CanvasRenderingContext2D, point: Vec2, lineWidth: number, strokeStyle: string, fillStyle: string): void {
        this.setContextParameters(ctx, lineWidth, strokeStyle, fillStyle);
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    executeCommand(command: PencilCommand): void {
        const ctx = this.drawingService.baseCtx;
        if (command.strokePaths.length === 1 && command.strokePaths[0].length === 1) {
            this.drawDot(ctx, command.strokePaths[0][0], command.strokeThickness, command.primaryColor, command.primaryColor);
            return;
        }
        command.strokePaths.forEach((path) => {
            ctx.beginPath();
            this.drawLine(ctx, path, command.strokeThickness, command.primaryColor, command.primaryColor);
        });
    }

    private setContextParameters(ctx: CanvasRenderingContext2D, lineWidth: number, strokeStyle: string, fillStyle: string): void {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.lineCap = 'round';
    }
}
