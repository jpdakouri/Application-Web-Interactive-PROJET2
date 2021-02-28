import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ShapeCommand } from '@app/classes/tool-commands/shape-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Sign } from '@app/services/services-constants';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { KeyboardButtons, MouseButtons } from '@app/utils/enums/list-boutton-pressed';
import { ShapeStyle } from '@app/utils/enums/shape-style';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
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
            this.drawRectangle(this.drawingService.previewCtx, this.mouseDownCoord);
            if (this.shiftDown) {
                this.drawSquare(this.mouseDownCoord);
            }
            this.drawRectangle(this.drawingService.baseCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Escape) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
        }
        if (event.key === KeyboardButtons.Shift) {
            this.shiftDown = true;
            this.updatePreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && event.key === KeyboardButtons.Shift) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();

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

    private isMouseInFirstQuadrant(): boolean {
        //  mouse is in first quadrant (+/+)
        return Math.sign(this.mouseDownCoord.x) === Sign.Positive && Math.sign(this.mouseDownCoord.y) === Sign.Positive;
    }

    private isMouseInSecondQuadrant(): boolean {
        // mouse is in third quadrant (-/-)
        return Math.sign(this.mouseDownCoord.x) === Sign.Negative && Math.sign(this.mouseDownCoord.y) === Sign.Negative;
    }

    private isMouseInThirdQuadrant(): boolean {
        // mouse is in fourth quadrant (-/+)
        return Math.sign(this.mouseDownCoord.x) === Sign.Negative && Math.sign(this.mouseDownCoord.y) === Sign.Positive;
    }

    private isMouseInFourthQuadrant(): boolean {
        // mouse is in second quadrant (+/-)
        return Math.sign(this.mouseDownCoord.x) === Sign.Positive && Math.sign(this.mouseDownCoord.y) === Sign.Negative;
    }

    private isXGreaterThanY(): boolean {
        return Math.abs(this.mouseDownCoord.x) > Math.abs(this.mouseDownCoord.y);
    }

    private isYGreaterThanX(): boolean {
        return Math.abs(this.mouseDownCoord.y) > Math.abs(this.mouseDownCoord.x);
    }

    private drawSquare(grid: Vec2): void {
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
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        this.drawPerimeter(this.drawingService.previewCtx, currentCoord);
        if (this.shiftDown) {
            this.drawSquare(currentCoord);
        }
        this.drawRectangle(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    executeCommand(command: ShapeCommand): void {
        // TODO
        return;
    }
}
