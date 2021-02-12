import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
// import { KeyboardKeys, MouseButton } from '@app/enums/rectangle-enums';
// import { ShapeStyle } from '@app/enums/shape-style';
import { DrawingService } from '@app/services/drawing/drawing.service';

// import { DEFAULT_COLOR_BLACK, DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';

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

export enum shapeStyle {
    Outline = 'outline',
    Filled = 'filled',
    FilledOutline = 'filledOutline',
}

export enum sign {
    Negative = -1,
    Positive = 1,
}

const REVOLUTION = 360;

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private firstGrid: Vec2;
    private shiftDown: boolean;

    private lineThickness: number;
    private primaryColour: string;
    private secondaryColor: string;
    private shapeStyle: shapeStyle;

    constructor(drawingService: DrawingService) {
        super(drawingService);

        this.lineThickness = 1;
        this.primaryColour = 'black';
        this.secondaryColor = 'blue';
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
            if (this.shiftDown) {
                this.drawCircle(this.mouseDownCoord);
                // this.updatePreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawEllipse(this.drawingService.baseCtx, this.mouseDownCoord);
            this.clearPath();
        }
        // this.drawEllipse(this.drawingService.baseCtx, this.mouseDownCoord);
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

    drawOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = this.lineThickness;
        const tempGrid = { ...this.mouseDownCoord };
        ctx.strokeRect(tempGrid.x - Math.abs(finalGrid.x - tempGrid.x), tempGrid.y - Math.abs(finalGrid.y - tempGrid.y), finalGrid.x, finalGrid.y);
        ctx.ellipse(this.firstGrid.x, this.firstGrid.y, Math.abs(finalGrid.x), Math.abs(finalGrid.y), 0, 0, REVOLUTION, false);
        ctx.stroke();
    }

    drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.primaryColour;
        ctx.ellipse(this.firstGrid.x, this.firstGrid.y, Math.abs(finalGrid.x), Math.abs(finalGrid.y), 0, 0, REVOLUTION, false);
        ctx.fill();
        ctx.stroke();
    }

    drawFilledOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.primaryColour;
        ctx.lineWidth = this.lineThickness;
        ctx.strokeStyle = this.secondaryColor;
        ctx.ellipse(
            this.firstGrid.x,
            this.firstGrid.y,
            Math.abs(finalGrid.x) - this.lineThickness,
            Math.abs(finalGrid.y) - this.lineThickness,
            0,
            0,
            REVOLUTION,
            false,
        );
        ctx.fill();
        ctx.stroke();
        ctx.ellipse(this.firstGrid.x, this.firstGrid.y, Math.abs(finalGrid.x), Math.abs(finalGrid.y), 0, 0, REVOLUTION, false);
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
        // cadrant en bas a droite (+/+)
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
            this.isYGreaterThanX() ? (grid.x = -grid.y) : (grid.y = -grid.x);
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        switch (this.shapeStyle) {
            case shapeStyle.Outline:
                this.drawOutline(ctx, finalGrid);
                break;

            case shapeStyle.Filled:
                this.drawFilled(ctx, finalGrid);
                break;

            case shapeStyle.FilledOutline:
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
        if (this.shiftDown) {
            this.drawCircle(currentCoord);
            this.drawEllipse(this.drawingService.previewCtx, currentCoord);
        }
        this.drawEllipse(this.drawingService.previewCtx, currentCoord);
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
