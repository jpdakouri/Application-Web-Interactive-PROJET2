import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_POS, BLUE_POS, GREEN_POS, MAX_BYTE_VALUE, RED_POS } from '@app/services/services-constants';
import { MagnetismService } from '@app/services/tools/magnetism-service/magnetism.service';
import { PIXELS_ARROW_STEPS } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';

export enum controlPoints {
    topLeft = 'topLeft',
    topRight = 'topRight',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
}
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
    currentCornerSelected: controlPoints;

    isMagnetismOff: boolean = true;
    shiftDown: boolean;
    dragActive: boolean;
    private activeDistance: Vec2;
    buffer: boolean;
    initialTopLeftCorner?: Vec2;
    height: number;
    width: number;
    isSelectionDone: boolean;

    constructor(drawingService: DrawingService, public currentColorService: CurrentColorService, public magnetismService: MagnetismService) {
        super(drawingService, currentColorService);
        this.topLeftCorner = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.currentCornerSelected = controlPoints.bottomLeft;
        SelectionService.selectionActive = this.dragActive = false;
        this.buffer = true;
        this.drawingService.selectedAreaCtx = this.drawingService.baseCtx;
        this.activeDistance = { x: 0, y: 0 };
    }

    defaultOnMouseDown(event: MouseEvent): void {
        if (this.isClickIn(this.firstGrid)) {
            const initial = this.getPositionFromMouse(event);
            this.offset.x = this.topLeftCorner.x - initial.x;
            this.offset.y = this.topLeftCorner.y - initial.y;
            this.dragActive = true;
        } else {
            this.buffer = false;
            const imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
            this.drawSelectionOnBase(imageData, this.topLeftCorner);
            this.registerUndo(imageData);
            this.deselect();
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
        this.initialTopLeftCorner = undefined;
        createImageBitmap(imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
        });
    }

    defaultOnKeyUp(event: KeyboardEvent): void {
        if (SelectionService.selectionActive) {
            switch (event.key) {
                case KeyboardButtons.Up:
                case KeyboardButtons.Down: {
                    this.activeDistance.y = 0;
                    break;
                }
                case KeyboardButtons.Right:
                case KeyboardButtons.Left: {
                    this.activeDistance.x = 0;
                    break;
                }
            }
        }
    }

    defaultOnKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === KeyboardButtons.Magnetism && SelectionService.selectionActive) {
            this.magnetismService.startKeys(this.drawingService.selectedAreaCtx);
            this.isMagnetismOff = !this.isMagnetismOff;
        }
        if (this.isMagnetismOff) {
            if (event.key === KeyboardButtons.Escape) this.cancelSelection();
            if (SelectionService.selectionActive) {
                if (event.key === KeyboardButtons.Left) {
                    this.activeDistance.x = -PIXELS_ARROW_STEPS;
                }
                if (event.key === KeyboardButtons.Down) {
                    this.activeDistance.y = PIXELS_ARROW_STEPS;
                }
                if (event.key === KeyboardButtons.Up) {
                    this.activeDistance.y = -PIXELS_ARROW_STEPS;
                }
                if (event.key === KeyboardButtons.Right) {
                    this.activeDistance.x = PIXELS_ARROW_STEPS;
                }
                this.firstGrid.x = this.topLeftCorner.x += this.activeDistance.x;
                this.firstGrid.y = this.topLeftCorner.y += this.activeDistance.y;
                this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
                this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
            }
        } else {
            switch (event.key) {
                case KeyboardButtons.Up: {
                    this.magnetismService.findNearestLineTop();
                    break;
                }
                case KeyboardButtons.Down: {
                    this.magnetismService.findNearestLineDown();
                    break;
                }
                case KeyboardButtons.Right: {
                    this.magnetismService.findNearestLineRight();
                    break;
                }
                case KeyboardButtons.Left: {
                    this.magnetismService.findNearestLineLeft();
                    break;
                }
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
        if (this.isMagnetismOff) {
            const currentCoord = { ...grid };
            this.topLeftCorner.x = currentCoord.x + this.offset.x;
            this.topLeftCorner.y = currentCoord.y + this.offset.y;
            this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
            this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
        } else {
            this.magnetismService.bringToClosestCrossOnGrid(grid, this.currentCornerSelected);
        }
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
