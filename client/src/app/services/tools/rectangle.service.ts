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

let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

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
            startX = this.getPositionFromMouse(event).x;
            startY = this.getPositionFromMouse(event).y;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            currentX = event.x - startX;
            currentY = event.y - startY;
            this.drawRectangle(this.drawingService.previewCtx, startX, startY, currentX, currentY);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // let position = this.getPositionFromMouse(event);
            // this.drawRectangle(this.drawingService.previewCtx, startX, startY, currentX, currentY);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, initX: number, initY: number, posX: number, posY: number): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.rect(initX, initY, posX, posY);
        ctx.stroke();
    }

    private clearPath(): void {
        // this.rectangle = [];
    }
}
