import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export enum controlPoints {
    topLeft = 'topLeft',
    topRight = 'topRight',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
    midLeft = 'midLeft',
    midTop = 'midTop',
    midRight = 'midRight',
    midBottom = 'bmidBottom',
}

const RANGE = 30;

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends Tool {
    private resizers: Map<SelectionStatus, Vec2>;
    private currentSelection: CanvasRenderingContext2D;
    private status: SelectionStatus;

    gridSize: number;
    lastPosition: Vec2;
    lockedResizer: Vec2;
    mousePositionHandler: MousePositionHandlerService;
    constructor(drawingService: DrawingService, currentColor: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColor);
        this.mousePositionHandler = mousePositionHandler;
        this.status = SelectionStatus.OFF;
        this.currentSelection = this.drawingService.selectedAreaCtx;
        this.resizers = new Map<SelectionStatus, Vec2>();
        this.resizers
            .set(SelectionStatus.TOP_LEFT_BOX, { x: 0, y: 0 })
            .set(SelectionStatus.TOP_RIGHT_BOX, { x: 1, y: 0 })
            .set(SelectionStatus.BOTTOM_LEFT_BOX, { x: 0, y: 1 })
            .set(SelectionStatus.BOTTOM_RIGHT_BOX, { x: 1, y: 1 })
            .set(SelectionStatus.MIDDLE_LEFT_BOX, { x: 0, y: 1 / 2 })
            .set(SelectionStatus.TOP_MIDDLE_BOX, { x: 1 / 2, y: 0 })
            .set(SelectionStatus.MIDDLE_RIGHT_BOX, { x: 1, y: 1 / 2 })
            .set(SelectionStatus.BOTTOM_MIDDLE_BOX, { x: 1 / 2, y: 1 });
    }

    // onMouseMove(event: MouseEvent): void {
    //     // if (this.mouseDown) {
    //     //     this.verifyInRangeCross(this.getPositionFromMouse(event));
    //     // }
    // }

    startKeys(): void {
        this.setStatus(SelectionStatus.TOP_LEFT_BOX);
        this.gridSize = this.drawingService.gridSize;
        // this.lastPosition = { x: this.drawingService.selectedAreaCtx.canvas.offsetLeft, y: this.drawingService.selectedAreaCtx.canvas.offsetTop };
        this.updatePosition(this.gridSize);
    }

    findNearestLineRight(): number {
        const kThGrid = Math.floor(this.lockedResizer.x / this.gridSize) + (this.lockedResizer.x % this.gridSize === 0 ? 1 : 0);
        const distance = this.lockedResizer.x - kThGrid * this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.left = this.drawingService.selectedAreaCtx.canvas.offsetLeft - distance + 'px';
        this.findLockedResizer();
        return distance;
    }

    findNearestLineLeft(): number {
        const kThGrid = Math.floor(this.lockedResizer.x / this.gridSize) - (this.lockedResizer.x % this.gridSize === 0 ? 1 : 0);
        const distance = this.lockedResizer.x - kThGrid * this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.left = this.drawingService.selectedAreaCtx.canvas.offsetLeft - distance + 'px';
        this.findLockedResizer();
        return distance;
    }

    findNearestLineTop(): number {
        const kThGrid = Math.floor(this.lockedResizer.y / this.gridSize) - (this.lockedResizer.y % this.gridSize === 0 ? 1 : 0);
        const distance = this.lockedResizer.y - kThGrid * this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.drawingService.selectedAreaCtx.canvas.offsetTop - distance + 'px';
        this.findLockedResizer();
        return distance;
    }

    findNearestLineDown(): number {
        const kThGrid = Math.floor(this.lockedResizer.y / this.gridSize) + (this.lockedResizer.y % this.gridSize === 0 ? 1 : 0);
        const distance = this.lockedResizer.y - kThGrid * this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.drawingService.selectedAreaCtx.canvas.offsetTop - distance + 'px';
        this.findLockedResizer();
        return distance;
    }

    updatePosition(grid: number): void {
        this.gridSize = grid;
        if (this.status !== SelectionStatus.OFF) {
            console.log(' taille ' + this.drawingService.selectedAreaCtx.canvas.offsetLeft);
            this.findNearestLineLeft();
            this.findNearestLineTop();
        }
    }

    isMouseOnTopLeftCorner(mouseCoord: Vec2): boolean {
        const topLeftCorner = { x: this.drawingService.selectedAreaCtx.canvas.offsetLeft, y: this.drawingService.selectedAreaCtx.canvas.offsetTop };
        return (
            topLeftCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < topLeftCorner.x + RANGE &&
            topLeftCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < topLeftCorner.y + RANGE
        );
    }

    isMouseOnTopRightCorner(mouseCoord: Vec2): boolean {
        const topRightCorner = {
            x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
            y: this.currentSelection.canvas.height,
        };

        return (
            topRightCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < topRightCorner.x + RANGE &&
            topRightCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < topRightCorner.y + RANGE
        );
    }

    isMouseOnBottomLeftCorner(mouseCoord: Vec2): boolean {
        const bottomLeftCorner = {
            x: this.currentSelection.canvas.offsetLeft,
            y: this.currentSelection.canvas.height + this.currentSelection.canvas.height,
        };

        return (
            bottomLeftCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < bottomLeftCorner.x + RANGE &&
            bottomLeftCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < bottomLeftCorner.y + RANGE
        );
    }

    isMouseOnBottomRightCorner(mouseCoord: Vec2): boolean {
        const bottomRightCorner = {
            x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
            y: this.currentSelection.canvas.height + this.currentSelection.canvas.height,
        };

        return (
            bottomRightCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < bottomRightCorner.x + RANGE &&
            bottomRightCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < bottomRightCorner.y + RANGE
        );
    }

    verifyInRangeCross(mouseCoord: Vec2): boolean {
        return Math.abs(this.gridSize - mouseCoord.x) <= RANGE && Math.abs(mouseCoord.y) <= RANGE;
    }

    setStatus(status: SelectionStatus): void {
        console.log('status ' + this.status);
        this.status = status;
        this.findLockedResizer();
    }

    findLockedResizer(): void {
        const posResize = { x: this.resizers.get(this.status)?.x, y: this.resizers.get(this.status)?.y } as Vec2;
        this.lockedResizer = {
            x: posResize.x * this.drawingService.selectedAreaCtx.canvas.width + this.drawingService.selectedAreaCtx.canvas.offsetLeft,
            y: posResize.y * this.drawingService.selectedAreaCtx.canvas.height + this.drawingService.selectedAreaCtx.canvas.offsetTop,
        };
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
}
