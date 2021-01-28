import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/mock-mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LigneService extends Tool {
    private started: boolean;
    private pathData: Vec2[];
    private lastDot: Vec2;
    private newDot: Vec2;
    private tempDot: Vec2;
    private dotRadius: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.clearPath();
            this.lastDot = this.newDot;
            this.started = true;

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.newDot = this.mouseDownCoord;

            this.drawDot(this.drawingService.baseCtx, this.mouseDownCoord);
            this.drawLinee(this.drawingService.baseCtx, this.lastDot);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.tempDot = mousePosition;

            this.drawLinee(this.drawingService.previewCtx, this.tempDot);
        }
    }

    private drawDot(ctx: CanvasRenderingContext2D, point: Vec2): void {
        // valeur devra etre choisi dans la bare a outil
        // peut etre fix pour l'instant
        // tslint:disable-next-line:no-magic-numbers
        this.dotRadius = 5;

        ctx.beginPath();
        ctx.arc(point.x, point.y, this.dotRadius, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private drawLinee(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(this.newDot.x, this.newDot.y);
        ctx.stroke();
    }
}
