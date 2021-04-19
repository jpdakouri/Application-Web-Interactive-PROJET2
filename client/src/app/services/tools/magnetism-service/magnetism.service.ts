import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
import { RANGE } from '../tools-constants';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends Tool {
    private resizers: Map<SelectionStatus, Vec2>;
    status: SelectionStatus;
    currentSelection: CanvasRenderingContext2D;
    gridSize: number;
    isMagnetismOnGoing: boolean = false;
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
            .set(SelectionStatus.BOTTOM_MIDDLE_BOX, { x: 1 / 2, y: 1 })
            .set(SelectionStatus.CENTER, { x: 1 / 2, y: 1 / 2 });
    }

    // onMouseMove(event: MouseEvent): void {
    //     console.log('valeur mouseDown ' + this.mouseDown);
    //     if (this.mouseDown) {
    //         if (this.verifyInRangeCross(this.getPositionFromMouse(event))) {
    //             console.log('rentrer');
    //             // this.updateDragPositionMagnetism(this.getPositionFromMouse(event));
    //             this.findNearestLineLeft(); // coller en x
    //             this.findNearestLineTop(); // coller en y
    //         }
    //     }
    // }

    onMouseUp(event: MouseEvent): void {
        this.isMagnetismOnGoing = false;
        this.mouseDown = false;
    }

    startKeys(): void {
        console.log('Magnetism ON!');
        this.setStatus(SelectionStatus.TOP_LEFT_BOX);
        this.gridSize = this.drawingService.gridSize;
        this.updatePosition(this.gridSize);
    }

    verifyInRangeCross(mouseCoord: Vec2): boolean {
        console.log('test');
        return Math.abs(mouseCoord.x - this.findNearestLineLeft()) <= RANGE && Math.abs(mouseCoord.y - this.findNearestLineTop()) <= RANGE;
    }

    isUsingMagnetism(): boolean {
        return this.status === SelectionStatus.TOP_LEFT_BOX;
    }

    findNearestLineRight(): number {
        const kThGrid = Math.floor(this.lockedResizer.x / this.gridSize) + 1;
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
        const kThGrid = Math.floor(this.lockedResizer.y / this.gridSize) + 1;
        const distance = this.lockedResizer.y - kThGrid * this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.top = this.drawingService.selectedAreaCtx.canvas.offsetTop - distance + 'px';
        this.findLockedResizer();
        return distance;
    }

    updatePosition(grid: number): void {
        this.gridSize = grid;
        if (this.status !== SelectionStatus.OFF) {
            this.findNearestLineLeft();
            this.findNearestLineTop();
        }
    }

    setStatus(status: SelectionStatus): void {
        this.status = status;
        this.mouseDown = true;
        this.isMagnetismOnGoing = true;
        this.findLockedResizer();
    }

    findLockedResizer(): void {
        const posResize = { x: this.resizers.get(this.status)?.x, y: this.resizers.get(this.status)?.y } as Vec2;
        this.lockedResizer = {
            x: posResize.x * this.drawingService.selectedAreaCtx.canvas.width + this.drawingService.selectedAreaCtx.canvas.offsetLeft,
            y: posResize.y * this.drawingService.selectedAreaCtx.canvas.height + this.drawingService.selectedAreaCtx.canvas.offsetTop,
        };
    }

    updateDragPositionMagnetism(coord: Vec2): void {
        const currentCoord = { ...coord };
        this.drawingService.selectedAreaCtx.canvas.style.top = currentCoord.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = currentCoord.x - 1 + 'px';
    }

    executeCommand(command: ToolCommand): void {
        return;
    }

    registerUndo(imageData: ImageData): void {
        return;
    }
}
