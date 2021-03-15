import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Sign } from '@app/services/services-constants';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { KeyboardButtons, MouseButtons } from '@app/utils/enums/list-boutton-pressed';

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
    private selectionActive: boolean;

    rectangleService: RectangleService;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.topLeftCorner = { x: 0, y: 0 };
        this.selectionActive = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        this.firstGrid = this.getPositionFromMouse(event);
        this.mouseMoved = false;
        if (this.mouseDown) {
            if (!this.selectionActive) {
                this.begin = this.getPositionFromMouse(event);
                this.updatePreview();
                this.selectionActive = true;
            } else {
                if (this.isClickIn(this.firstGrid)) {
                    console.log('click dedans');
                } else {
                    this.selectionActive = false;
                    this.drawingService.baseCtx.putImageData(this.imageData, this.topLeftCorner.x, this.topLeftCorner.y);
                    console.log('click dehors');
                }
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.selectionActive) {
            this.mouseMoved = true;
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
                this.makeSquare(this.mouseDownCoord);
                this.selectionRectangle(this.drawingService.previewCtx, this.mouseDownCoord);
            }
            this.selectionRectangle(this.drawingService.previewCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                if (this.selectionActive) {
                    this.topLeftCorner.y -= PIXELS_ARROW_STEPS;
                }
                break;
            }
            case KeyboardButtons.Down: {
                if (this.selectionActive) {
                    this.topLeftCorner.y += PIXELS_ARROW_STEPS;
                }
                break;
            }
            case KeyboardButtons.Right: {
                if (this.selectionActive) {
                    this.topLeftCorner.x += PIXELS_ARROW_STEPS;
                }
                break;
            }
            case KeyboardButtons.Left: {
                if (this.selectionActive) {
                    this.topLeftCorner.x -= PIXELS_ARROW_STEPS;
                }
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

    private makeSquare(grid: Vec2): void {
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

    private selectionRectangle(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        // Prendre la region de pixel
        this.imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.putImageData(this.imageData, this.topLeftCorner.x, this.topLeftCorner.y);

        // Mettre le backround white
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);

        // Print rectangle de selection
        ctx.setLineDash([numberFive, numberFifteen]);
        ctx.strokeRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        if (this.shiftDown) {
            this.makeSquare(currentCoord);
            this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        }
        this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    private isClickIn(firstGrid: Vec2): boolean {
        if (firstGrid.x < this.topLeftCorner.x || firstGrid.x > this.topLeftCorner.x + this.imageData.width) {
            return false;
        }
        if (firstGrid.y < this.topLeftCorner.y || firstGrid.y > this.topLeftCorner.y + this.imageData.height) {
            return false;
        }
        return true;
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
