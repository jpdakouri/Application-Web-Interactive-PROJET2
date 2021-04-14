import { Injectable } from '@angular/core';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

const DISTANCE_TEST = 1;
@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends SelectionService {
    isMagnetismActivated: boolean;
    gridService: GridService;
    constructor(
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        gridService: GridService,
    ) {
        super(drawingService, currentColorService);
        this.gridService = gridService;
    }

    // onMouseMove(event: MouseEvent): void {

    // }

    onKeyDown(event: KeyboardEvent): void {
        this.isMagnetismActivated = true;
        // this.firstGrid = this.getPositionFromMouse()
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
    }

    keepWithinGridDimension(): void {}

    updateArrowPositionMagnetism(): void {
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
        this.drawingService.selectedAreaCtx.canvas.style.top = this.topLeftCorner.y - 1 + 'px';
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x - 1 + 'px';
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
    updatePreview(): void {
        throw new Error('Method not implemented.');
    }
}
