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
                this.updatePreview();
            }
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
            this.drawCircle(this.mouseDownCoord);
            this.drawEllipse(this.drawingService.previewCtx, this.mouseDownCoord);
            this.clearPath();
        }
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);
        ctx.strokeStyle = 'black';

        const startCoord = { ...this.firstGrid };
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
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = this.lineThickness;
        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);
        const startCoord = { ...this.firstGrid };

        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, width / 2, height / 2, 0, 0, REVOLUTION, false);
        ctx.stroke();
    }

    drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.primaryColour;
        ctx.lineWidth = this.lineThickness;

        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);
        const startCoord = { ...this.firstGrid };

        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, width / 2, height / 2, 0, 0, REVOLUTION, false);
        ctx.fill();
        ctx.stroke();
    }

    drawFilledOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = this.primaryColour;
        ctx.fillStyle = this.secondaryColor;
        ctx.lineWidth = this.lineThickness;

        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);
        const startCoord = { ...this.firstGrid };

        ctx.ellipse(
            startCoord.x + width / 2,
            startCoord.y + height / 2,
            width / 2 - this.lineThickness,
            height / 2 - this.lineThickness,
            0,
            0,
            REVOLUTION,
            false,
        );
        ctx.fill();
        ctx.stroke();
        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, width / 2, height / 2, 0, 0, REVOLUTION, false);
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
            console.log(this.mouseDownCoord);
            grid.x = grid.y = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

        if (this.isMouseInSecondQuadrant()) {
            grid.x = grid.y = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.y);
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
        // ctx.beginPath();
        this.drawingService.previewCtx.beginPath();
        // this.drawPerimeter()
        this.drawPerimeter(this.drawingService.previewCtx, currentCoord);
        if (this.shiftDown) {
            this.drawCircle(currentCoord);
        }
        this.drawEllipse(this.drawingService.previewCtx, currentCoord);
        // end path
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
