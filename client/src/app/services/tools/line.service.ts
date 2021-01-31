import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/mock-mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const PIXEL_DISTANCE = 20;
export const WAIT_TIME = 500;

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private started: boolean;
    private pathData: Vec2[];
    private dotData: Vec2[];

    private dotRadius: number;
    private lineWidth: number;
    private withDots: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.clearPresented();

        // valeur devra etre choisi dans la bare a outil
        // peut etre fix pour l'instant
        // tslint:disable-next-line:no-magic-numbers
        this.dotRadius = 5;
        this.lineWidth = 1;
        this.withDots = true;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.started = true;

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);

            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            const mousePosition = this.getPositionFromMouse(event);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.drawPreviewLine(this.drawingService.previewCtx, mousePosition, this.pathData[this.pathData.length - 1]);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    onDblClick(event: MouseEvent): void {
        this.started = false;
        this.dotData = this.pathData;
        this.drawLine(this.drawingService.baseCtx, this.dotData);

        if (this.verifyFirstPoint()) {
            console.log('it is my start point ');
        }

        this.clearPath();
        this.clearPresented();
    }

    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.shiftKey) {
        } else if (event.key === 'Escape') {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.started = false;
        } else if (event.key === 'Backspace') {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pathData.pop();
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            event.preventDefault();
        }

        console.log(event);
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private clearPresented(): void {
        this.dotData = [];
    }

    private drawPreviewLine(ctx: CanvasRenderingContext2D, previewPoint: Vec2, lastPoint: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(previewPoint.x, previewPoint.y);
        ctx.stroke();
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            ctx.lineWidth = this.lineWidth;
        }
        ctx.stroke();
        if (this.withDots)
            for (const dot of path) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, this.dotRadius, 0, 2 * Math.PI, true);
                ctx.fill();
            }
    }

    private verifyFirstPoint(): boolean {
        const tempFirstDot = this.dotData[0];
        const tempLastDot = this.dotData[this.dotData.length - 1];
        return (
            tempLastDot.x + PIXEL_DISTANCE > tempFirstDot.x &&
            tempLastDot.x - PIXEL_DISTANCE < tempFirstDot.x &&
            tempLastDot.y + PIXEL_DISTANCE > tempFirstDot.y &&
            tempLastDot.y - PIXEL_DISTANCE < tempFirstDot.y
        );
    }
}
