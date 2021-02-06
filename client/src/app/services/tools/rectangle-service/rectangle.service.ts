import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardKeys, MouseButton } from '@app/enums/rectangle-enums';
import { ShapeStyle } from '@app/enums/shape-style';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearPath();
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
            this.drawRectangle(this.drawingService.previewCtx, this.mouseDownCoord);
            this.updatePreview();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardKeys.Escape) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
        } else if (event.shiftKey) {
            this.shiftDown = true;
            this.updatePreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && !event.shiftKey) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    drawOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.currentColourService.getPrimaryColorRgba();
        ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilledOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.currentColourService.getPrimaryColorRgba();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        switch (this.shapeStyle) {
            case ShapeStyle.Outline:
                this.drawOutline(ctx, finalGrid);
                break;

            case ShapeStyle.Filled:
                this.drawFilled(ctx, finalGrid);
                break;

            case ShapeStyle.FilledOutline:
                this.drawFilledOutline(ctx, finalGrid);
                break;

            default:
                this.drawOutline(ctx, finalGrid);
                break;
        }
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.previewCtx, this.mouseDownCoord);

        if (this.shiftDown) {
            if (this.mouseDownCoord.x > this.mouseDownCoord.y) {
                this.mouseDownCoord.y = this.mouseDownCoord.x;
            } else if (this.mouseDownCoord.x < this.mouseDownCoord.y) {
                this.mouseDownCoord.x = this.mouseDownCoord.y;
            }
        }
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
