import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

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

export enum rayType {
    Border = 'border',
    Fill = 'fill',
    BorderAndFilled = 'borderAndFilled',
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
    private rt: rayType;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();

        this.primaryColour = 'black';
        this.secondaryColour = 'blue';
        this.lineWidth = 1;
        this.rt = rayType.Fill;
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
                if (Math.abs(this.mouseDownCoord.x) > Math.abs(this.mouseDownCoord.y)) {
                    this.mouseDownCoord.y = this.mouseDownCoord.x;
                } else if (Math.abs(this.mouseDownCoord.x) < Math.abs(this.mouseDownCoord.y)) {
                    this.mouseDownCoord.x = this.mouseDownCoord.y;
                }
                this.updatePreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, this.mouseDownCoord, this.rt);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardKeys.Escape:
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
                break;
            case KeyboardKeys.One:
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

    private drawRectangle(ctx: CanvasRenderingContext2D, initGrid: Vec2, finalGrid: Vec2, rt: rayType): void {
        switch (rt) {
            case rayType.Border:
                ctx.beginPath();
                ctx.strokeStyle = this.secondaryColour;
                ctx.lineWidth = this.lineWidth;
                ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;

            case rayType.Fill:
                ctx.beginPath();
                ctx.fillStyle = this.primaryColour;
                ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;

            case rayType.BorderAndFilled:
                ctx.beginPath();
                ctx.fillStyle = this.primaryColour;
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.secondaryColour;
                ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;
        }
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.previewCtx, this.firstGrid, this.mouseDownCoord, this.rt);
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
