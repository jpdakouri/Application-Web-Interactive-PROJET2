import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends SelectionService {
    isMagnetismActivated: boolean;
    gridService: GridService;
    mousePositionHandler: MousePositionHandlerService;
    constructor(
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        gridService: GridService,
    ) {
        super(drawingService, currentColorService);
        this.gridService = gridService;
        this.mousePositionHandler = mousePositionHandler;
    }

    onMouseMove(event: MouseEvent): void {
        this.updatePreview();
    }

    onKeyDown(event: KeyboardEvent): void {
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
        }
        this.updateArrowPositionMagnetism();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.defaultOnKeyUp(event);
        this.updatePreview();
    }

    setCoordToNearestCrossOnGrid(coord: Vec2): void {
        if (coord.x % this.gridService.gridSize) {
            coord.x = coord.x + (this.gridService.gridSize - (coord.x % this.gridService.gridSize));
        }

        if (coord.y % this.gridService.gridSize) {
            coord.y = coord.y + (this.gridService.gridSize - (coord.y % this.gridService.gridSize));
        }
    }

    updateCoordToCurrentValues(): void {
        this.firstGrid = { ...this.mouseDownCoord };
        this.topLeftCorner = { ...this.initialTopLeftCorner };
        // this.topLeftCorner = { x: 0, y: 0 };
        // this.updateTopLeftCorner();
    }

    updateArrowPositionMagnetism(): void {
        // this.updateCoordToCurrentValues();
        if (SelectionService.selectionActive && this.upPressed) {
            this.topLeftCorner.y -= this.gridService.gridSize;
            this.firstGrid.y -= this.gridService.gridSize;
        }
        if (SelectionService.selectionActive && this.downPressed) {
            this.topLeftCorner.y += this.gridService.gridSize;
            this.firstGrid.y += this.gridService.gridSize;
        }
        if (SelectionService.selectionActive && this.rightPressed) {
            this.topLeftCorner.x += this.gridService.gridSize;
            this.firstGrid.x += this.gridService.gridSize;
        }
        if (SelectionService.selectionActive && this.leftPressed) {
            this.topLeftCorner.x -= this.gridService.gridSize;
            this.firstGrid.x -= this.gridService.gridSize;
        }
        // this.setCoordToNearestCrossOnGrid({
        //     x: this.drawingService.selectedAreaCtx.canvas.width,
        //     y: this.drawingService.selectedAreaCtx.canvas.height,
        // });
        console.log('grid clean ? ' + this.topLeftCorner.x + ' ' + this.topLeftCorner.y);
        // this.setCoordToNearestCrossOnGrid(this.firstGrid);
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
    }

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

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;

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

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }

    updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        if (this.shiftDown) {
            this.mousePositionHandler.makeSquare(this.mouseDownCoord, currentCoord);
        }
        this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }
}
