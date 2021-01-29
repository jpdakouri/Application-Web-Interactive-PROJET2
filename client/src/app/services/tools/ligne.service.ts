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
            this.started = true;

            this.lastDot = this.newDot;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.newDot = this.mouseDownCoord;

            this.pathData.push(this.mouseDownCoord);

            this.drawDot(this.drawingService.baseCtx, this.newDot);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.tempDot = mousePosition;

            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.started) {
            this.onMouseMove(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
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

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(this.newDot.x, this.newDot.y);
        }
        ctx.stroke();
    }
}
