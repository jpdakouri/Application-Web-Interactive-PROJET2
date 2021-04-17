import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GRID_SIZE_CHANGE_VALUE, MAX_GRID_OPACITY, MAX_GRID_SIZE, MIN_GRID_OPACITY, MIN_GRID_SIZE } from '@app/services/tools/tools-constants';
import { MagnetismService } from '../tools/magnetism-service/magnetism.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    readonly minGridSize: number = MIN_GRID_SIZE;
    readonly maxGridSize: number = MAX_GRID_SIZE;
    readonly minOpacity: number = MIN_GRID_OPACITY;
    readonly maxOpacity: number = MAX_GRID_OPACITY;
    gridSize: number = this.minGridSize;
    gridOpacity: string = this.maxOpacity.toString();
    showGrid: boolean = false;

    constructor(private drawingService: DrawingService, private magnetismService: MagnetismService) {
        this.drawingService.gridSize = this.minGridSize;
    }

    newGrid(newSize: number | null): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.drawingService.gridSize = newSize ? newSize : this.drawingService.gridSize;
        const canvaHeight = this.drawingService.baseCtx.canvas.height;
        const canvasWidth = this.drawingService.baseCtx.canvas.width;
        this.drawingService.gridCtx.beginPath();
        for (let i = 0; i <= canvaHeight / this.drawingService.gridSize; i++) {
            this.drawingService.gridCtx.moveTo(0, i * this.drawingService.gridSize);
            this.drawingService.gridCtx.lineTo(canvasWidth, i * this.drawingService.gridSize);
        }

        for (let i = 0; i <= canvasWidth / this.drawingService.gridSize; i++) {
            this.drawingService.gridCtx.moveTo(i * this.drawingService.gridSize, 0);
            this.drawingService.gridCtx.lineTo(i * this.drawingService.gridSize, canvaHeight);
        }
        this.drawingService.gridCtx.strokeStyle = `rgba(0, 0, 0, ${this.gridOpacity})`;
        this.drawingService.gridCtx.stroke();
        this.magnetismService.updatePosition(this.drawingService.gridSize);
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
            (increaseSize && this.drawingService.gridSize + GRID_SIZE_CHANGE_VALUE <= this.maxGridSize) ||
            (!increaseSize && this.drawingService.gridSize - GRID_SIZE_CHANGE_VALUE >= this.minGridSize)
        );
    }

    getGridSize(): number {
        return this.drawingService.gridSize;
    }
}
