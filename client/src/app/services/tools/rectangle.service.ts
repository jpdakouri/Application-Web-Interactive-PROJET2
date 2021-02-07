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
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
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
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();

            if (event.shiftKey) {
                this.shiftDown = true;
                this.mouseDownCoord.x = Math.max(Math.abs(this.mouseDownCoord.x), Math.abs(this.mouseDownCoord.y))
                    ? this.mouseDownCoord.x
                    : this.mouseDownCoord.y;
                this.mouseDownCoord.y = this.mouseDownCoord.x;
                this.updatePreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRectangle(this.drawingService.baseCtx, this.mouseDownCoord);
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
            console.log('event');
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    drawOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = this.lineThickness;
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.primaryColour;
        ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    drawFilledOutline(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.fillStyle = this.primaryColour;
        ctx.lineWidth = this.lineThickness;
        ctx.strokeStyle = this.secondaryColor;
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
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
            if (this.mouseDownCoord.x > this.mouseDownCoord.y) {
                currentCoord.y = this.mouseDownCoord.x;
            } else if (this.mouseDownCoord.x < this.mouseDownCoord.y) {
                currentCoord.x = this.mouseDownCoord.y;
            }
        }
        this.drawRectangle(this.drawingService.previewCtx, currentCoord);
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
