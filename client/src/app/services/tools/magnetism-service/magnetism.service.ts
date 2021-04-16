import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
import { SelectionService } from '../selection-service/selection.service';

export enum controlPoints {
    topLeft,
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends Tool {
    gridSize: number;
    lastPosition: Vec2;
    mousePositionHandler: MousePositionHandlerService;
    currentSelection: CanvasRenderingContext2D;
    constructor(drawingService: DrawingService, currentColor: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColor);
        this.mousePositionHandler = mousePositionHandler;
        this.currentSelection = this.drawingService.baseCtx;
    }

    // startMove(ctx: CanvasRenderingContext2D): void {
    //     this.currentSelection = ctx;
    //     this.gridSize = this.drawingService.gridSize;
    // }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && SelectionService.selectionActive) {
        }
    }

    startKeys(ctx: CanvasRenderingContext2D): void {
        console.log('Magnetism Start');

        this.currentSelection = ctx;
        this.gridSize = this.drawingService.gridSize;
        this.lastPosition = { x: ctx.canvas.offsetLeft, y: ctx.canvas.offsetTop };
        this.updatePosition(this.gridSize);
    }

    findNearestLineRight(): void {
        const topRightCornerX = this.currentSelection.canvas.width + this.currentSelection.canvas.offsetLeft;
        const kThGrid = Math.floor(topRightCornerX / this.gridSize) + 1;
        const num = kThGrid * this.gridSize - topRightCornerX + this.currentSelection.canvas.offsetLeft;
        // console.log(topRightCornerX);
        // console.log(kThGrid, num + this.currentSelection.canvas.width);
        this.currentSelection.canvas.style.left = num + 'px';
        console.log('rightAfter ' + this.currentSelection.canvas.style.left);
    }

    findNearestLineLeft(): void {
        const kThGrid = Math.floor(this.currentSelection.canvas.offsetLeft / this.gridSize);
        const num = kThGrid * this.gridSize;
        // console.log(this.currentSelection.canvas.offsetLeft);
        // console.log(kThGrid, num);
        this.currentSelection.translate(num - this.currentSelection.canvas.offsetLeft, 0);
        console.log(' in left ' + this.currentSelection.canvas.offsetLeft);
        // this.currentSelection.canvas.style.left = num;
    }

    findNearestLineTop(): void {
        const kThGrid = Math.floor(this.currentSelection.canvas.offsetTop / this.gridSize);
        const num = kThGrid * this.gridSize;
        // console.log(this.currentSelection.canvas.offsetTop);
        // console.log(kThGrid, num);
        this.currentSelection.canvas.style.top = num + 'px';
    }

    findNearestLineDown(): void {
        const bottom = this.currentSelection.canvas.height + this.currentSelection.canvas.offsetTop;
        const kThGrid = Math.floor(bottom / this.gridSize) + 1;
        const num = this.currentSelection.canvas.offsetTop - bottom + kThGrid * this.gridSize;
        // console.log(bottom);
        // console.log(kThGrid, num + this.currentSelection.canvas.height);
        this.currentSelection.canvas.style.left = num + 'px';
    }

    updatePosition(grid: number): void {
        this.gridSize = grid;
        this.currentSelection.canvas.style.left = this.lastPosition.x + 'px';
        this.currentSelection.canvas.style.top = this.lastPosition.y + 'px';
        this.findNearestLineLeft();
        this.findNearestLineTop();
    }

    isClickIn(firstGrid: Vec2): boolean {
        // if (firstGrid.x < this.lastPosition.x || firstGrid.x > this.lastPosition.x + this.currentSelection.canvas.width) {
        //     return false;
        // }
        // if (firstGrid.y < this.lastPosition.y || firstGrid.y > this.lastPosition.y + this.currentSelection.canvas.height) {
        //     return false;
        // }
        return true;
    }

    cornerSelected(coord: Vec2): Vec2 {
        switch (coord) {
            case topRight:
                break;

            default:
                break;
        }
        return { x: 0, y: 0 };
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
}
