import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Sign } from '@app/utils/enums/rgb-settings';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

// import { ShapeStyle } from '@app/utils/enums/shape-style';

// constante temporaire simplement pour facilier le merge
const numberFive = 5;
const numberFifteen = 15;
@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends Tool {
    private firstGrid: Vec2;
    private topLeftCorner: Vec2;
    private begin: Vec2;
    private end: Vec2;
    private imageData: ImageData;
    private shiftDown: boolean;

    rectangleService: RectangleService;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.topLeftCorner = { x: 0, y: 0 };
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.begin = this.getPositionFromMouse(event);
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
            this.end = this.getPositionFromMouse(event);
            this.updateTopLeftCorner();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.shiftDown) {
                this.drawSquare(this.mouseDownCoord);
                this.selectBox(this.drawingService.previewCtx, this.mouseDownCoord);
            }
            this.selectBox(this.drawingService.previewCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                this.topLeftCorner.y -= PIXELS_ARROW_STEPS;
                break;
            }
            case KeyboardButtons.Down: {
                this.topLeftCorner.y += PIXELS_ARROW_STEPS;
                break;
            }
            case KeyboardButtons.Right: {
                this.topLeftCorner.x += PIXELS_ARROW_STEPS;
                break;
            }
            case KeyboardButtons.Left: {
                this.topLeftCorner.x -= PIXELS_ARROW_STEPS;
                break;
            }
            case KeyboardButtons.Shift: {
                this.shiftDown = true;
                this.updatePreview();
                break;
            }
            case KeyboardButtons.Escape: {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(this.imageData, this.topLeftCorner.x, this.topLeftCorner.y);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftDown && event.key === KeyboardButtons.Shift) {
            this.shiftDown = false;
            this.updatePreview();
        }
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = 'blue';
        ctx.setLineDash([numberFive, numberFifteen]);

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

    private updateTopLeftCorner(): void {
        if (this.begin.x > this.end.x) {
            this.topLeftCorner.x = this.end.x;
        }
        if (this.begin.x < this.end.x) {
            this.topLeftCorner.x = this.begin.x;
        }
        if (this.begin.y > this.end.y) {
            this.topLeftCorner.y = this.end.y;
        }
        if (this.begin.y < this.end.y) {
            this.topLeftCorner.y = this.begin.y;
        }
    }

    private selectBox(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.putImageData(this.imageData, this.topLeftCorner.x, this.topLeftCorner.y);

        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);

        ctx.setLineDash([numberFive, numberFifteen]);
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        if (this.shiftDown) {
            this.drawSquare(currentCoord);
        }
        this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
