import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_POS, BLUE_POS, GREEN_POS, MAX_BYTE_VALUE, RED_POS } from '@app/services/services-constants';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Sign } from '@app/utils/enums/rgb-settings';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

// import { ShapeStyle } from '@app/utils/enums/shape-style';

// constante temporaire simplement pour facilier le merge

@Injectable({
    providedIn: 'root',
})
export class SelectionEllipseService extends Tool {
    private firstGrid: Vec2;
    private begin: Vec2;
    private end: Vec2;
    private shiftDown: boolean;
    private dragActive: boolean;
    topLeftCorner: Vec2;
    selectionActive: boolean;
    height: number;
    width: number;
    private offset: Vec2;
    private upPressed: boolean;
    private downPressed: boolean;
    private leftPressed: boolean;
    private rightPressed: boolean;

    rectangleService: RectangleService;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.topLeftCorner = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.selectionActive = this.dragActive = false;
        this.drawingService.selectedAreaCtx = this.drawingService.baseCtx;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        this.firstGrid = this.getPositionFromMouse(event);
        this.mouseMoved = false;
        if (this.mouseDown) {
            if (!this.selectionActive) {
                this.drawingService.clearCanvas(this.drawingService.selectedAreaCtx);
                this.begin = this.getPositionFromMouse(event);
                this.updatePreview();
                this.selectionActive = true;
            } else {
                if (this.isClickIn(this.firstGrid)) {
                    const initial = this.getPositionFromMouse(event);
                    this.offset.x = this.topLeftCorner.x - initial.x;
                    this.offset.y = this.topLeftCorner.y - initial.y;
                    this.dragActive = true;
                    console.log('click dedans');
                } else {
                    this.selectionActive = false;
                    this.drawEllipse(this.drawingService.selectedAreaCtx, this.mouseDownCoord);
                    this.drawingService.selectedAreaCtx.strokeStyle = 'rgba(255, 255, 255, 0)';
                    this.drawingService.selectedAreaCtx.setLineDash([]);
                    this.drawingService.selectedAreaCtx.stroke();
                    const imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
                    createImageBitmap(imageData).then((imgBitmap) => {
                        // this.clipArea(this.drawingService.baseCtx, this.end);
                        this.drawingService.baseCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
                        // this.drawingService.baseCtx.restore();
                    });
                    console.log('click dehors');
                }
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.selectionActive && !this.dragActive) {
            this.mouseMoved = true;
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();
        } else if (this.mouseDown && this.selectionActive && this.dragActive) {
            this.updateDragPosition(this.getPositionFromMouse(event));
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && this.selectionActive && !this.dragActive && this.mouseMoved) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.end = this.getPositionFromMouse(event);
            this.updateTopLeftCorner();
            if (this.shiftDown) {
                this.makeCircle(this.mouseDownCoord);
            }
            this.selectEllipse(this.drawingService.selectedAreaCtx, this.mouseDownCoord);
            this.drawEllipse(this.drawingService.selectedAreaCtx, this.mouseDownCoord);
            this.drawingService.selectedAreaCtx.stroke();
            this.drawingService.previewCtx.setLineDash([]);
            this.drawingService.baseCtx.setLineDash([]);
        }
        this.mouseDown = this.dragActive = this.mouseMoved = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                if (this.selectionActive) {
                    this.upPressed = true;
                }
                break;
            }
            case KeyboardButtons.Down: {
                if (this.selectionActive) {
                    this.downPressed = true;
                }
                break;
            }
            case KeyboardButtons.Right: {
                if (this.selectionActive) {
                    this.rightPressed = true;
                }
                break;
            }
            case KeyboardButtons.Left: {
                if (this.selectionActive) {
                    this.leftPressed = true;
                }
                break;
            }
            case KeyboardButtons.Shift: {
                this.shiftDown = true;
                this.updatePreview();
                break;
            }
            case KeyboardButtons.Escape: {
                this.clearPath();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.topLeftCorner = { x: 0, y: 0 };
            }
        }
        this.updateArrowPosition();
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                if (this.selectionActive) {
                    this.upPressed = false;
                }
                break;
            }
            case KeyboardButtons.Down: {
                if (this.selectionActive) {
                    this.downPressed = false;
                }
                break;
            }
            case KeyboardButtons.Right: {
                if (this.selectionActive) {
                    this.rightPressed = false;
                }
                break;
            }
            case KeyboardButtons.Left: {
                if (this.selectionActive) {
                    this.leftPressed = false;
                }
                break;
            }
            case KeyboardButtons.Shift: {
                this.shiftDown = false;
                this.updatePreview();
                break;
            }
        }
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

    private makeCircle(grid: Vec2): void {
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

    private drawEllipse(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = this.lineThickness = 0.5;
        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;
        ctx.ellipse(startCoord.x + width / 2, startCoord.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI, false);
        ctx.closePath();
    }

    private clipArea(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.save();
        this.drawEllipse(ctx, finalGrid);
        ctx.clip('nonzero');
    }

    private selectEllipse(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.drawingService.clearCanvas(ctx);
        const imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        const bottomRightCorner: Vec2 = { x: imageData.width, y: imageData.height };

        // Remplace les pixels vierges du canvas par des pixels blancs
        for (let i = 3; i < imageData.data.length; i += ALPHA_POS) {
            if (imageData.data[i] === 0) {
                imageData.data[i - RED_POS] = MAX_BYTE_VALUE;
                imageData.data[i - GREEN_POS] = MAX_BYTE_VALUE;
                imageData.data[i - BLUE_POS] = MAX_BYTE_VALUE;
                imageData.data[i] = MAX_BYTE_VALUE;
            }
        }
        createImageBitmap(imageData).then((imgBitmap) => {
            this.clipArea(ctx, finalGrid);
            this.drawingService.selectedAreaCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
            ctx.restore();
        });
        this.height = imageData.height;
        this.width = imageData.width;
        // Resize le selectedAreaCtx
        ctx.canvas.width = bottomRightCorner.x;
        ctx.canvas.height = bottomRightCorner.y;
        // Deplacer le resultat de la selection topLeftCorner
        ctx.translate(-this.topLeftCorner.x, -this.topLeftCorner.y);
        // Remettre la selection à la position de la souris
        ctx.canvas.style.top = this.topLeftCorner.y + 'px';
        ctx.canvas.style.left = this.topLeftCorner.x + 'px';
        // Remplir de blanc
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawEllipse(this.drawingService.baseCtx, finalGrid);
        this.drawingService.baseCtx.fill();
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        if (this.shiftDown) {
            this.makeCircle(currentCoord);
        }
        this.drawEllipse(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.stroke();
    }

    private isClickIn(firstGrid: Vec2): boolean {
        if (firstGrid.x < this.topLeftCorner.x || firstGrid.x > this.topLeftCorner.x + this.width) {
            return false;
        }
        if (firstGrid.y < this.topLeftCorner.y || firstGrid.y > this.topLeftCorner.y + this.height) {
            return false;
        }
        return true;
    }

    private updateDragPosition(grid: Vec2): void {
        const currentCoord = { ...grid };
        this.topLeftCorner.x = currentCoord.x + this.offset.x;
        this.topLeftCorner.y = currentCoord.y + this.offset.y;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x + 'px';
    }

    private updateArrowPosition(): void {
        if (this.selectionActive && this.upPressed) {
            this.topLeftCorner.y -= PIXELS_ARROW_STEPS;
            this.firstGrid.y -= PIXELS_ARROW_STEPS;
        }
        if (this.selectionActive && this.downPressed) {
            this.topLeftCorner.y += PIXELS_ARROW_STEPS;
            this.firstGrid.y += PIXELS_ARROW_STEPS;
        }
        if (this.selectionActive && this.rightPressed) {
            this.topLeftCorner.x += PIXELS_ARROW_STEPS;
            this.firstGrid.x += PIXELS_ARROW_STEPS;
        }
        if (this.selectionActive && this.leftPressed) {
            this.topLeftCorner.x -= PIXELS_ARROW_STEPS;
            this.firstGrid.x -= PIXELS_ARROW_STEPS;
        }
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x + 'px';
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
