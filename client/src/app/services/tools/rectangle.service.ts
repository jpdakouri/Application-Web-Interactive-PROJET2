import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

let currentX = 0;
let currentY = 0;
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.firstGrid = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            currentX = this.getPositionFromMouse(event).x - this.firstGrid.x;
            currentY = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, currentX, currentY);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(this.drawingService.baseCtx, this.firstGrid, currentX, currentY);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onShift(event: KeyboardEvent): void {
        if (event.shiftKey && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            currentX = Math.abs(this.firstGrid.x - currentX);
            currentY = Math.abs(this.firstGrid.y - currentY);
            Math.max(currentX, currentY);
            currentX = currentY;
            this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, currentX, currentY);
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, initGrid: Vec2, w: number, h: number): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, w, h);
    }

    private clearPath(): void {
        // this.rectangle = [];
    }
}
