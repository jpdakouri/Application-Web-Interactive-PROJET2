import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA, ARRAY_OFFSET, MAX_PIXEL_VALUE } from '@app/services/services-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

// Algorithm inspired by:
// https://www.geeksforgeeks.org/flood-fill-algorithm-implement-fill-paint/
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, undoRedo: UndoRedoService) {
        super(drawingService, currentColorService);
    }

    fillColor: Color = { R: 0, G: 0, B: 0, A: 0 };
    startColor: Color = { R: 0, G: 0, B: 0, A: 0 };
    canvasImageData: ImageData;
    newCanvasImageData: ImageData;
    bucketTolerance: number = 0;
    canvas: HTMLCanvasElement;
    baseCtx: CanvasRenderingContext2D;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.getCanvas();
            this.setFillColor();
            this.setStartColor();
            this.bfs();
        }
    }

    executeCommand(command: ToolCommand): number {
        return 0;
    }

    isValidCoord(x: number, y: number): boolean {
        if (x < 0 || y < 0) return false;
        if (x > this.canvas.width - 1 || y > this.canvas.height - 1) return false;
        return true;
    }

    bfs(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const x = this.mouseDownCoord.x;
        const y = this.mouseDownCoord.y;
        let visited: number[][];
        visited = new Array<number[]>();
        for (let i = 0; i < width; i++) {
            const column: number[] = new Array<number>();
            for (let j = 0; j < height; j++) {
                column.push(0);
            }
            visited.push(column);
        }
        visited[x][y] = 1;
        const bfsQueue: Vec2[] = [];
        bfsQueue.push({ x, y });
        while (bfsQueue.length > 0) {
            const coord: Vec2 = bfsQueue[0];
            this.putRGBAInArray(coord.x, coord.y);
            bfsQueue.shift();
            this.visit(visited, bfsQueue, coord.x, coord.y);
        }
        this.baseCtx.putImageData(this.newCanvasImageData, 0, 0);
    }

    // tslint:disable-next-line: cyclomatic-complexity
    visit(visited: number[][], bfsQueue: Vec2[], x: number, y: number): void {
        const rightColor = this.getRGBAFromCoord(x + 1, y);
        if (this.isValidCoord(x + 1, y) && visited[x + 1][y] !== 1 && !this.isSimilarColor(rightColor)) {
            console.log(rightColor, this.startColor);
            console.log((this.bucketTolerance / 100) * MAX_PIXEL_VALUE);
        }
        if (this.isValidCoord(x + 1, y) && visited[x + 1][y] !== 1 && this.isSimilarColor(rightColor)) {
            bfsQueue.push({ x: x + 1, y });
            visited[x + 1][y] = 1;
        }

        const leftColor = this.getRGBAFromCoord(x - 1, y);
        if (this.isValidCoord(x - 1, y) && visited[x - 1][y] !== 1 && this.isSimilarColor(leftColor)) {
            bfsQueue.push({ x: x - 1, y });
            visited[x - 1][y] = 1;
        }
        const upperColor = this.getRGBAFromCoord(x, y + 1);
        if (this.isValidCoord(x, y + 1) && visited[x][y + 1] !== 1 && this.isSimilarColor(upperColor)) {
            bfsQueue.push({ x, y: y + 1 });
            visited[x][y + 1] = 1;
        }

        const lowerColor = this.getRGBAFromCoord(x, y - 1);
        if (this.isValidCoord(x, y - 1) && visited[x][y - 1] !== 1 && this.isSimilarColor(lowerColor)) {
            bfsQueue.push({ x, y: y - 1 });
            visited[x][y - 1] = 1;
        }
    }

    getCanvas(): void {
        this.baseCtx = this.drawingService.getBaseContext();
        this.canvas = this.drawingService.getCanvas();
        this.newCanvasImageData = this.canvasImageData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    isTransparent(color: Color): boolean {
        return color.A === 0;
    }
    isHalf(color: Color): boolean {
        const A = color.A === 128 || color.A === 127;
        return A;
    }

    getRGBAFromCoord(x: number, y: number): Color {
        const data = this.canvasImageData.data;
        const width = this.canvas.width;
        const R = data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET];
        const G = data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + 1];
        const B = data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + 2];
        const A = data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + ALPHA];
        let color: Color = { R, G, B, A };
        if (this.isTransparent(color) || this.isHalf(color)) {
            color = { R: 255, G: 255, B: 255, A: 255 };
        }
        return color;
    }

    putRGBAInArray(x: number, y: number): void {
        const color = this.fillColor;
        const width = this.canvas.width;
        this.newCanvasImageData.data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET] = color.R;
        this.newCanvasImageData.data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + 1] = color.G;
        this.newCanvasImageData.data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + 2] = color.B;
        this.newCanvasImageData.data[y * (width * ARRAY_OFFSET) + x * ARRAY_OFFSET + ALPHA] = color.A;
    }

    setStartColor(): void {
        const startPixel = this.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1).data;
        this.startColor.R = startPixel[0];
        this.startColor.G = startPixel[1];
        this.startColor.B = startPixel[2];
        this.startColor.A = startPixel[ALPHA];
        if (this.isTransparent(this.startColor) || this.isHalf(this.startColor)) {
            this.startColor = { R: 255, G: 255, B: 255, A: 255 };
        }
    }

    setFillColor(): void {
        let str = this.currentColorService.getPrimaryColorRgba();
        str = str.replace(/[^\d,]/g, '');
        const arr = str.split(',');
        this.fillColor.R = +arr[0];
        this.fillColor.G = +arr[1];
        this.fillColor.B = +arr[2];
        const alpha = Math.round(MAX_PIXEL_VALUE * +arr[ALPHA]);
        this.fillColor.A = alpha;
    }
    isSimilarColor(colorA: Color): boolean {
        const colorB = this.startColor;
        const threshold = (this.bucketTolerance / 100) * MAX_PIXEL_VALUE;
        const R = Math.abs(colorA.R - colorB.R);
        const G = Math.abs(colorA.G - colorB.G);
        const B = Math.abs(colorA.B - colorB.B);
        const A = Math.abs(colorA.A - colorB.A);
        if (colorA.R === 0 && colorA.G === 0 && colorA.B === 0 && colorA.A < 255) {
            return A < threshold + 50;
        }
        return R < threshold && G < threshold && B < threshold && A < threshold;
    }
}
