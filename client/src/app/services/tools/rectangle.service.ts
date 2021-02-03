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

export enum KeyboardKeys {
    Escape = 'Escape',
    Shift = 'Shift',
    One = '1',
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;

    private primaryColour: string;
    private secondaryColour: string;
    private lineWidth: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();

        this.primaryColour = 'black';
        this.secondaryColour = 'blue';
        this.lineWidth = 5;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
            this.updatePreview();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();

            if (event.shiftKey) {
                this.shiftDown = true;
                if (this.mouseDownCoord.x > this.mouseDownCoord.y) {
                    this.mouseDownCoord.y = this.mouseDownCoord.x;
                } else if (this.mouseDownCoord.x < this.mouseDownCoord.y) {
                    this.mouseDownCoord.x = this.mouseDownCoord.y;
                }
                this.updatePreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, this.mouseDownCoord);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardKeys.Escape:
                this.clearPath();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case KeyboardKeys.One:
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            default:
                break;
        }
        if (event.shiftKey) {
            this.shiftDown = true;
            if (this.shiftDown) {
                if (this.mouseDownCoord.x > this.mouseDownCoord.y) {
                    this.mouseDownCoord.y = this.mouseDownCoord.x;
                } else if (this.mouseDownCoord.x < this.mouseDownCoord.y) {
                    this.mouseDownCoord.x = this.mouseDownCoord.y;
                }
                this.updatePreview();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && !event.shiftKey) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, initGrid: Vec2, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, this.mouseDownCoord);
    }
    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
