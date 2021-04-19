import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GRID_SIZE_CHANGE_VALUE, MAX_GRID_OPACITY, MAX_GRID_SIZE, MIN_GRID_OPACITY, MIN_GRID_SIZE } from '@app/services/tools/tools-constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    readonly minGridSize: number;
    readonly maxGridSize: number;
    readonly minOpacity: number;
    readonly maxOpacity: number;
    gridSize: number;
    gridOpacity: string;
    showGrid: boolean;

    constructor(private drawingService: DrawingService) {
        this.minGridSize = MIN_GRID_SIZE;
        this.maxGridSize = MAX_GRID_SIZE;
        this.minOpacity = MIN_GRID_OPACITY;
        this.maxOpacity = MAX_GRID_OPACITY;
        this.gridSize = this.minGridSize;
        this.gridOpacity = this.maxOpacity.toString();
        this.showGrid = false;
    }

    newGrid(newSize: number | null): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.gridSize = newSize ? newSize : this.gridSize;
        const canvaHeight = this.drawingService.baseCtx.canvas.height;
        const canvasWidth = this.drawingService.baseCtx.canvas.width;
        this.drawingService.gridCtx.beginPath();
        for (let i = 0; i <= canvaHeight / this.gridSize; i++) {
            this.drawingService.gridCtx.moveTo(0, i * this.gridSize);
            this.drawingService.gridCtx.lineTo(canvasWidth, i * this.gridSize);
        }

        for (let i = 0; i <= canvasWidth / this.gridSize; i++) {
            this.drawingService.gridCtx.moveTo(i * this.gridSize, 0);
            this.drawingService.gridCtx.lineTo(i * this.gridSize, canvaHeight);
        }
        this.drawingService.gridCtx.strokeStyle = `rgba(0, 0, 0, ${this.gridOpacity})`;
        this.drawingService.gridCtx.stroke();
    }

    clear(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.gridOpacity = this.maxOpacity.toString();
    }

    changeOpacity(value: number | null): void {
        this.gridOpacity = value ? value.toFixed(1) : this.gridOpacity;
        this.newGrid(null);
    }

    gridSizeCanModify(increaseSize: boolean): boolean {
        return (
            (increaseSize && this.gridSize + GRID_SIZE_CHANGE_VALUE <= this.maxGridSize) ||
            (!increaseSize && this.gridSize - GRID_SIZE_CHANGE_VALUE >= this.minGridSize)
        );
    }
}
