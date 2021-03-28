import { Injectable } from '@angular/core';
import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '@app/services/tools/tools-constants';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    readonly minGridSize: number = MIN_GRID_SIZE;
    readonly maxGridSize: number = MAX_GRID_SIZE;
    gridSize: number = this.minGridSize;
    gridOpacity: number = 1;

    constructor(private drawingService: DrawingService) {}

    newGrid(newSize: number | null): void {
        this.gridSize = newSize ? newSize : this.minGridSize;
        this.clear();
        const canvaHeight = this.drawingService.baseCtx.canvas.height;
        const canvasWidth = this.drawingService.baseCtx.canvas.width;

        for (let i = 0; i <= canvaHeight / this.gridSize; i++) {
            this.drawingService.gridCtx.beginPath();
            this.drawingService.gridCtx.moveTo(0, i * this.gridSize);
            this.drawingService.gridCtx.lineTo(canvasWidth, i * this.gridSize);
            this.drawingService.gridCtx.stroke();
        }

        for (let i = 0; i <= canvaHeight / this.gridSize; i++) {
            this.drawingService.gridCtx.beginPath();
            this.drawingService.gridCtx.moveTo(i * this.gridSize, 0);
            this.drawingService.gridCtx.lineTo(i * this.gridSize, canvaHeight);
            this.drawingService.gridCtx.stroke();
        }
    }

    clear(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }

    changeOpacity(value: number) {}
}
