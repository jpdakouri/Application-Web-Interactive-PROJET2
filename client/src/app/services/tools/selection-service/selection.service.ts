import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_POS, BLUE_POS, GREEN_POS, MAX_BYTE_VALUE, RED_POS } from '@app/services/services-constants';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionService extends Tool {
    static selectionActive: boolean;
    firstGrid: Vec2;
    topLeftCorner: Vec2;
    firstGridClip: Vec2;
    finalGridClip: Vec2;
    offset: Vec2;
    shiftDown: boolean;
    dragActive: boolean;
    upPressed: boolean;
    downPressed: boolean;
    leftPressed: boolean;
    rightPressed: boolean;
    buffer: boolean;
    initialTopLeftCorner: Vec2;
    height: number;
    width: number;
    isSelectionDone: boolean;

    currentColorService: CurrentColorService;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
        this.currentColorService = currentColorService;
        this.topLeftCorner = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        SelectionService.selectionActive = this.dragActive = false;
        this.buffer = true;
        this.drawingService.selectedAreaCtx = this.drawingService.baseCtx;
    }

    defaultOnMouseDown(event: MouseEvent): void {
        if (this.isClickIn(this.firstGrid)) {
            const initial = this.getPositionFromMouse(event);
            this.offset.x = this.topLeftCorner.x - initial.x;
            this.offset.y = this.topLeftCorner.y - initial.y;
            this.dragActive = true;
        } else {
            SelectionService.selectionActive = false;
            this.buffer = false;
            const imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
            this.drawSelectionOnBase(imageData, this.topLeftCorner);
            this.deselect();
            this.registerUndo(imageData);
        }
    }
    abstract registerUndo(imageData: ImageData): void;

    deselect(): void {
        SelectionService.selectionActive = false;
        this.drawingService.selectedAreaCtx.canvas.width = this.drawingService.selectedAreaCtx.canvas.height = 0;
        this.isSelectionDone = false;
    }

    drawSelectionOnBase(imageData: ImageData, topLeftCorner: Vec2): void {
        createImageBitmap(imageData).then((imgBitmap) => {
            this.drawingService.baseCtx.drawImage(imgBitmap, topLeftCorner.x, topLeftCorner.y);
        });
    }

    getSelectionImageData(): ImageData {
        return this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
    }

    hasSelection(): boolean {
        return this.drawingService.selectedAreaCtx.canvas.width !== 0 && this.drawingService.selectedAreaCtx.canvas.height !== 0;
    }

    setSelection(imageData: ImageData): void {
        SelectionService.selectionActive = true;
        this.isSelectionDone = true;
        this.topLeftCorner.x = 0;
        this.topLeftCorner.y = 0;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
        this.width = imageData.width;
        this.height = imageData.height;
        this.drawingService.selectedAreaCtx.canvas.width = this.width;
        this.drawingService.selectedAreaCtx.canvas.height = this.height;
        createImageBitmap(imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
        });
    }

    defaultOnKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        switch (event.key) {
            case KeyboardButtons.Up: {
                if (SelectionService.selectionActive) {
                    this.upPressed = true;
                }
                break;
            }
            case KeyboardButtons.Down: {
                if (SelectionService.selectionActive) {
                    this.downPressed = true;
                }
                break;
            }
            case KeyboardButtons.Right: {
                if (SelectionService.selectionActive) {
                    this.rightPressed = true;
                }
                break;
            }
            case KeyboardButtons.Left: {
                if (SelectionService.selectionActive) {
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
                this.cancelSelection();
            }
        }
        this.updateArrowPosition();
    }

    defaultOnKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                if (SelectionService.selectionActive) {
                    this.upPressed = false;
                }
                break;
            }
            case KeyboardButtons.Down: {
                if (SelectionService.selectionActive) {
                    this.downPressed = false;
                }
                break;
            }
            case KeyboardButtons.Right: {
                if (SelectionService.selectionActive) {
                    this.rightPressed = false;
                }
                break;
            }
            case KeyboardButtons.Left: {
                if (SelectionService.selectionActive) {
                    this.leftPressed = false;
                }
                break;
            }
        }
    }

    updateTopLeftCorner(): void {
        if (this.firstGridClip.x > this.finalGridClip.x) {
            this.topLeftCorner.x = this.finalGridClip.x;
        }
        if (this.firstGridClip.x < this.finalGridClip.x) {
            this.topLeftCorner.x = this.firstGridClip.x;
        }
        if (this.firstGridClip.y > this.finalGridClip.y) {
            this.topLeftCorner.y = this.finalGridClip.y;
        }
        if (this.firstGridClip.y < this.finalGridClip.y) {
            this.topLeftCorner.y = this.firstGridClip.y;
        }
    }

    updateDragPosition(grid: Vec2): void {
        const currentCoord = { ...grid };
        this.topLeftCorner.x = currentCoord.x + this.offset.x;
        this.topLeftCorner.y = currentCoord.y + this.offset.y;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
    }

    updateArrowPosition(): void {
        if (SelectionService.selectionActive && this.upPressed) {
            this.topLeftCorner.y -= PIXELS_ARROW_STEPS;
            this.firstGrid.y -= PIXELS_ARROW_STEPS;
        }
        if (SelectionService.selectionActive && this.downPressed) {
            this.topLeftCorner.y += PIXELS_ARROW_STEPS;
            this.firstGrid.y += PIXELS_ARROW_STEPS;
        }
        if (SelectionService.selectionActive && this.rightPressed) {
            this.topLeftCorner.x += PIXELS_ARROW_STEPS;
            this.firstGrid.x += PIXELS_ARROW_STEPS;
        }
        if (SelectionService.selectionActive && this.leftPressed) {
            this.topLeftCorner.x -= PIXELS_ARROW_STEPS;
            this.firstGrid.x -= PIXELS_ARROW_STEPS;
        }
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
    }

    isClickIn(firstGrid: Vec2): boolean {
        if (firstGrid.x < this.topLeftCorner.x || firstGrid.x > this.topLeftCorner.x + this.width) {
            return false;
        }
        if (firstGrid.y < this.topLeftCorner.y || firstGrid.y > this.topLeftCorner.y + this.height) {
            return false;
        }
        return true;
    }

    cancelSelection(): void {
        console.log('y');
        this.drawingService.selectedAreaCtx.canvas.width = 0;
        this.drawingService.selectedAreaCtx.canvas.height = 0;
        SelectionService.selectionActive = false;
        this.topLeftCorner = { x: 0, y: 0 };
    }

    resetFirstGrid(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    replaceEmptyPixels(imageData: ImageData): void {
        for (let i = 3; i < imageData.data.length; i += ALPHA_POS) {
            if (imageData.data[i] === 0) {
                imageData.data[i - RED_POS] = MAX_BYTE_VALUE;
                imageData.data[i - GREEN_POS] = MAX_BYTE_VALUE;
                imageData.data[i - BLUE_POS] = MAX_BYTE_VALUE;
                imageData.data[i] = MAX_BYTE_VALUE;
            }
        }
    }

    abstract updatePreview(): void;
}
