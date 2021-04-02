import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
import { MousePositionHandlerService } from '../mouse-position-handler-service/mouse-position-handler.service';
import { RectangleService } from '../rectangle-service/rectangle.service';
import { PIXELS_ARROW_STEPS } from '../tools-constants';
import { UndoRedoService } from '../undo-redo-service/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    firstGrid: Vec2;
    topLeftCorner: Vec2;
    firstGridClip: Vec2;
    finalGridClip: Vec2;
    offset: Vec2;
    shiftDown: boolean;
    selectionActive: boolean;
    dragActive: boolean;
    upPressed: boolean;
    downPressed: boolean;
    leftPressed: boolean;
    rightPressed: boolean;
    mousePositionHandler: MousePositionHandlerService;
    initialTopLeftCorner: Vec2;
    height: number;
    width: number;
    isSelectionDone: boolean;

    rectangleService: RectangleService;
    currentColorService: CurrentColorService;
    constructor(
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        undoRedo: UndoRedoService,
    ) {
        super(drawingService, currentColorService);
        this.currentColorService = currentColorService;
        this.topLeftCorner = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.selectionActive = this.dragActive = false;
        this.drawingService.selectedAreaCtx = this.drawingService.baseCtx;
        this.mousePositionHandler = mousePositionHandler;
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
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
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

    clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
