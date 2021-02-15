import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS, REVOLUTION } from '@app/services/tools/tools-constants';
import { KeyboardKeys, MouseButton, sign } from '@app/utils/enums/rectangle-enums';
import { ShapeStyle } from '@app/utils/enums/shape-style';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
            this.updatePreview();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.shiftDown) {
                this.drawCircle(this.mouseDownCoord);
            }
            this.drawEllipse(this.drawingService.baseCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardKeys.Escape) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
        } else if (event.key === KeyboardKeys.Shift) {
            this.shiftDown = true;
            this.updatePreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && event.key === KeyboardKeys.Shift) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = 'black';

        const startCoord = { ...this.firstGrid };
        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);

        if (finalGrid.x < 0) {
            startCoord.x += finalGrid.x;
        }
        if (finalGrid.y < 0) {
            startCoord.y += finalGrid.y;
        }
        ctx.strokeRect(startCoord.x, startCoord.y, width, height);
    }

    drawOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;

        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;

        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, REVOLUTION, false);
        ctx.stroke();
    }

    drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.currentColourService.getPrimaryColorRgba();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;

        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;

        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, REVOLUTION, false);
        ctx.fill();
        ctx.stroke();
    }

    drawFilledOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.currentColourService.getPrimaryColorRgba();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();

        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;

        ctx.ellipse(
            startCoord.x + width / 2,
            startCoord.y + height / 2,
            Math.abs(width / 2 - (this.lineThickness || DEFAULT_MIN_THICKNESS)),
            Math.abs(height / 2 - (this.lineThickness || DEFAULT_MIN_THICKNESS)),
            0,
            0,
            REVOLUTION,
            false,
        );
        ctx.fill();
        ctx.stroke();
        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, REVOLUTION, false);
        ctx.stroke();
    }

    private isMouseInFirstQuadrant(): boolean {
        // souris dans cadrant en bas a droite (+/+)
        return Math.sign(this.mouseDownCoord.x) === sign.Positive && Math.sign(this.mouseDownCoord.y) === sign.Positive;
    }

    private isMouseInSecondQuadrant(): boolean {
        // souris dans cadrant en haut a gauche (-/-)
        return Math.sign(this.mouseDownCoord.x) === sign.Negative && Math.sign(this.mouseDownCoord.y) === sign.Negative;
    }

    private isMouseInThirdQuadrant(): boolean {
        // souris dans cadrant en haute droite (+/-)
        return Math.sign(this.mouseDownCoord.x) === sign.Negative && Math.sign(this.mouseDownCoord.y) === sign.Positive;
    }

    private isMouseInFourthQuadrant(): boolean {
        // souris dans cadrant en haute droite (-/+)
        return Math.sign(this.mouseDownCoord.x) === sign.Positive && Math.sign(this.mouseDownCoord.y) === sign.Negative;
    }

    private isXGreaterThanY(): boolean {
        return Math.abs(this.mouseDownCoord.x) > Math.abs(this.mouseDownCoord.y);
    }

    private isYGreaterThanX(): boolean {
        return Math.abs(this.mouseDownCoord.y) > Math.abs(this.mouseDownCoord.x);
    }

    drawCircle(grid: Vec2): void {
        if (this.isMouseInFirstQuadrant()) {
            grid.x = grid.y = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

        if (this.isMouseInSecondQuadrant()) {
            grid.x = grid.y = Math.max(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

        if (this.isMouseInThirdQuadrant()) {
            this.isXGreaterThanY() ? (grid.x = -grid.y) : (grid.y = -grid.x);
        }

        if (this.isMouseInFourthQuadrant()) {
            this.isYGreaterThanX() ? (grid.y = -grid.x) : (grid.x = -grid.y);
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
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
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        this.drawPerimeter(this.drawingService.previewCtx, currentCoord);
        if (this.shiftDown) {
            this.drawCircle(currentCoord);
        }
        this.drawEllipse(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
