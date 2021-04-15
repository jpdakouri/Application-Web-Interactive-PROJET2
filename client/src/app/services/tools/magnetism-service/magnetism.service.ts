import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends Tool {
    topLeftCorner: Vec2;
    gridSize: number;
    mousePositionHandler: MousePositionHandlerService;
    constructor(drawingService: DrawingService, currentColor: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColor);
        this.gridSize = this.drawingService.gridSize;
        this.topLeftCorner = { x: this.drawingService.selectedAreaCtx.canvas.offsetLeft, y: this.drawingService.selectedAreaCtx.canvas.offsetTop };
        this.updatePosition(this.gridSize);
        this.mousePositionHandler = mousePositionHandler;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (SelectionService.selectionActive) {
            switch (event.key) {
                case KeyboardButtons.Up: {
                    break;
                }
                case KeyboardButtons.Down: {
                    break;
                }
                case KeyboardButtons.Right: {
                    this.findNearestLineRight();
                    break;
                }
                case KeyboardButtons.Left: {
                    this.findNearestLineLeft();
                    break;
                }
            }
        }
    }

    findNearestLineRight(): void {
        const topRightCornerX = this.drawingService.selectedAreaCtx.canvas.width + this.drawingService.selectedAreaCtx.canvas.offsetLeft;
        const kThGrid = topRightCornerX / this.gridSize + 1;
        this.drawingService.selectedAreaCtx.canvas.style.left =
            kThGrid * this.gridSize - topRightCornerX + this.drawingService.selectedAreaCtx.canvas.offsetLeft + 'px';
    }

    findNearestLineLeft(): void {
        const kThGrid = this.drawingService.selectedAreaCtx.canvas.offsetLeft / this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.left = kThGrid * this.gridSize + 'px';
    }

    findNearestLineTop(): void {
        const kThGrid = this.drawingService.selectedAreaCtx.canvas.offsetTop / this.gridSize;
        this.drawingService.selectedAreaCtx.canvas.style.top = kThGrid * this.gridSize + 'px';
    }

    // getCoordToNearestCrossOnGrid(coord: Vec2): void {
    //     return { x: this.gridSize * (coord.x / this.gridSize), y: this.gridSize * (coord.y / this.gridSize) };
    // }

    // updateCoordToCurrentValues(): void {}

    updatePosition(grid: number): void {
        this.gridSize = grid;
        this.findNearestLineLeft();
        this.findNearestLineTop();
    }

    // updateArrowPositionMagnetism(): void {
    //     // this.updateCoordToCurrentValues();
    //     if (SelectionService.selectionActive && this.upPressed) {
    //         this.topLeftCorner.y -= this.gridSize;
    //         this.firstGrid.y -= this.gridSize;
    //         this.setCoordToNearestCrossOnGrid(this.topLeftCorner);
    //         // this.setCoordToNearestCrossOnGrid({
    //         //     x: this.drawingService.selectedAreaCtx.canvas.width,
    //         //     y: this.drawingService.selectedAreaCtx.canvas.height,
    //         // });
    //     }
    //     if (SelectionService.selectionActive && this.downPressed) {
    //         this.topLeftCorner.y += this.gridSize;
    //         this.firstGrid.y += this.gridSize;
    //         this.setCoordToNearestCrossOnGrid(this.topLeftCorner);
    //         // this.setCoordToNearestCrossOnGrid({
    //         //     x: this.drawingService.selectedAreaCtx.canvas.width,
    //         //     y: this.drawingService.selectedAreaCtx.canvas.height,
    //         // });
    //     }
    //     if (SelectionService.selectionActive && this.rightPressed) {
    //         this.topLeftCorner.x += this.gridSize;
    //         this.firstGrid.x += this.gridSize;
    //         this.setCoordToNearestCrossOnGrid(this.topLeftCorner);
    //         // this.setCoordToNearestCrossOnGrid({
    //         //     x: this.drawingService.selectedAreaCtx.canvas.width,
    //         //     y: this.drawingService.selectedAreaCtx.canvas.height,
    //         // });
    //     }
    //     if (SelectionService.selectionActive && this.leftPressed) {
    //         this.topLeftCorner.x += this.gridSize;
    //         this.firstGrid.x += this.gridSize;
    //         this.setCoordToNearestCrossOnGrid(this.topLeftCorner);
    //         // this.setCoordToNearestCrossOnGrid({
    //         //     x: this.drawingService.selectedAreaCtx.canvas.width,
    //         //     y: this.drawingService.selectedAreaCtx.canvas.height,
    //         // });
    //     }
    //     // this.setCoordToNearestCrossOnGrid({
    //     //     x: this.drawingService.selectedAreaCtx.canvas.width,
    //     //     y: this.drawingService.selectedAreaCtx.canvas.height,
    //     // });
    //     console.log('grid clean ? ' + this.topLeftCorner.x + ' ' + this.topLeftCorner.y);
    //     // this.setCoordToNearestCrossOnGrid(this.firstGrid);
    //     this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
    //     this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
    // }

    // verifies if B and C are counter clock wise from A
    // private ccw(A: Vec2, B: Vec2, C: Vec2): boolean {
    //     return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    // }

    // // algorithm found at https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
    // private verifiyCrossedLines(line1: Vec2[], line2: Vec2[]): boolean {
    //     return (
    //         this.ccw(line1[0], line2[0], line2[1]) !== this.ccw(line1[1], line2[0], line2[1]) &&
    //         this.ccw(line1[0], line1[1], line2[0]) !== this.ccw(line1[0], line1[1], line2[1])
    //     );
    // }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
}
