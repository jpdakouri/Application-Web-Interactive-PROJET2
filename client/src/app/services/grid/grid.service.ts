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
    gridOpacity: string = '1';
    showGrid: boolean = false;

    constructor(private drawingService: DrawingService, private magnetismService: MagnetismService) {
        this.gridSize = this.drawingService.gridSize;
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
        this.magnetismService.updatePosition(this.gridSize);
    }

    clear(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.gridOpacity = '1';
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
