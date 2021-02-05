import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardKeys, MouseButton } from '@app/enums/rectangle-enums';
import { ShapeStyle } from '@app/enums/shape-style';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shapeStyle = ShapeStyle.Filled;
        this.primaryColor = 'red';
        this.secondaryColor = '#000000';
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
            this.drawRectangle(
                this.drawingService.previewCtx,
                this.firstGrid,
                this.mouseDownCoord,
                this.shapeStyle ? this.shapeStyle : ShapeStyle.Outline,
            );
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

    private drawRectangle(ctx: CanvasRenderingContext2D, initGrid: Vec2, finalGrid: Vec2, shapeStyle: ShapeStyle): void {
        switch (shapeStyle) {
            case ShapeStyle.Outline:
                ctx.beginPath();
                ctx.strokeStyle = this.secondaryColor ? this.secondaryColor : '#000000';
                ctx.lineWidth = this.lineThickness ? this.lineThickness : 1;
                ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;

            case ShapeStyle.Filled:
                ctx.beginPath();
                ctx.fillStyle = this.primaryColor ? this.primaryColor : '#000000';
                ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;

            case ShapeStyle.FilledOutline:
                ctx.beginPath();
                ctx.fillStyle = this.primaryColor ? this.primaryColor : '#000000';
                ctx.lineWidth = this.lineThickness ? this.lineThickness : 1;
                ctx.strokeStyle = this.secondaryColor ? this.secondaryColor : '#000000';
                ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
                break;
        }
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(
            this.drawingService.previewCtx,
            this.firstGrid,
            this.mouseDownCoord,
            this.shapeStyle ? this.shapeStyle : ShapeStyle.Outline,
        );
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
