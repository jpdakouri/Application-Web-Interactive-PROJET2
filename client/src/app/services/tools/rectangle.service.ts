import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum KeyboardKeys {
    One = 0,
    Two = 1,
    Three = 3,
}

let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let width = 0;
let height = 0;

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    // private rectangle: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            // this.mouseDownCoord = this.getPositionFromMouse(event);
            startX = this.getPositionFromMouse(event).x;
            startY = this.getPositionFromMouse(event).y;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            // this.clearPath();
            currentX = this.getPositionFromMouse(event).x - startX;
            currentY = this.getPositionFromMouse(event).y - startY;
            this.drawingService.previewCtx.strokeRect(startX, startY, currentX, currentY);
            // this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(this.drawingService.baseCtx, startX, startY, currentX, currentY);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, initX: number, initY: number, w: number, h: number): void {
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(initX, initY, w - ctx.canvas.offsetLeft, h - ctx.canvas.offsetTop);
        // ctx.clearRect(initX, initY, w - ctx.canvas.offsetLeft, h - ctx.canvas.offsetTop);
    }

    private clearPath(): void {
        // this.rectangle = [];
    }
}
