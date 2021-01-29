import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/mock-mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const PIXEL_DISTANCE = 20;
export const WAIT_TIME = 250;

@Injectable({
    providedIn: 'root',
})
export class LigneService extends Tool {
    private started: boolean;
    private pathData: Vec2[];
    private presentedData: Vec2[];
    private dotRadius: number;
    private dblClick: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.presentedData = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.presentedData.push(this.mouseDownCoord);

            if (this.started) {
                this.pathData.push(this.presentedData[this.presentedData.length - 1]);
            } else {
                this.started = true;
            }

            this.presentedData[this.presentedData.length - 1] = this.mouseDownCoord;

            this.drawDot(this.drawingService.baseCtx, this.mouseDownCoord);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            this.clearPath();
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onDblClick(event: MouseEvent): void {
        this.started = false;
        this.dblClick = true;
        if (this.verifyFirstPoint()) {
            setTimeout(() => {
                console.log('x');
            }, WAIT_TIME);
        }
        console.log('y');
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
            ctx.lineTo(this.presentedData[this.presentedData.length - 1].x, this.presentedData[this.presentedData.length - 1].y);
        }
        ctx.stroke();
    }

    // private deleteLast(): void {}

    private verifyFirstPoint(): boolean {
        const tempFirstDot = this.presentedData[0];
        const tempLastDot = this.presentedData[this.presentedData.length - 1];
        return (
            tempLastDot.x + PIXEL_DISTANCE > tempFirstDot.x &&
            tempLastDot.x - PIXEL_DISTANCE < tempFirstDot.x &&
            tempLastDot.y + PIXEL_DISTANCE > tempFirstDot.y &&
            tempLastDot.y - PIXEL_DISTANCE < tempFirstDot.y
        );
    }
}
