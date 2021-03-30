import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
import { UndoRedoService } from '../undo-redo-service/undo-redo.service';

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

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.getCanvasImageData(this.drawingService.baseCtx, this.drawingService.canvas);
            this.setFillColor();
            this.setStartColor(event);
            this.bfs(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }
    }

    validCoord(x: number, y: number): boolean {
        if (x < 0 || y < 0) return false;
        if (x > this.drawingService.canvas.width - 1 || y > this.drawingService.canvas.height - 1) return false;
        return true;
    }

    bfs(x: number, y: number): void {
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        let visited: number[][];

        visited = new Array<number[]>();
        for (let i = 0; i < width; i++) {
            const column: number[] = new Array<number>();
            for (let j = 0; j < height; j++) {
                column.push(0);
            }
            visited.push(column);
        }

        const bfsQueue: Vec2[] = [];
        bfsQueue.push({ x, y });
        visited[x][y] = 1;

        this.getCanvasImageData(this.drawingService.baseCtx, this.drawingService.canvas);
        while (bfsQueue.length > 0) {
            const coord: Vec2 = bfsQueue[0];
            const x1 = coord.x;
            const y1 = coord.y;
            this.putRGBAInArray(x1, y1, this.fillColor);
            bfsQueue.shift();
            this.visit(visited, bfsQueue, x1, y1);
        }
        console.log(this.startColor);
        console.log(this.newCanvasImageData);
        this.drawingService.baseCtx.putImageData(this.newCanvasImageData, 0, 0);
    }

    visit(visited: number[][], bfsQueue: Vec2[], x: number, y: number): void {
        if (this.validCoord(x + 1, y) && visited[x + 1][y] !== 1 && this.getRGBAFromXYAndIsSameColor(x + 1, y, this.startColor)) {
            bfsQueue.push({ x: x + 1, y });
            visited[x + 1][y] = 1;
        }
        if (this.validCoord(x - 1, y) && visited[x - 1][y] !== 1 && this.getRGBAFromXYAndIsSameColor(x - 1, y, this.startColor)) {
            bfsQueue.push({ x: x - 1, y });
            visited[x - 1][y] = 1;
        }

        if (this.validCoord(x, y + 1) && visited[x][y + 1] !== 1 && this.getRGBAFromXYAndIsSameColor(x, y + 1, this.startColor)) {
            bfsQueue.push({ x, y: y + 1 });
            visited[x][y + 1] = 1;
        }
        if (this.validCoord(x, y - 1) && visited[x][y - 1] !== 1 && this.getRGBAFromXYAndIsSameColor(x, y - 1, this.startColor)) {
            bfsQueue.push({ x, y: y - 1 });
            visited[x][y - 1] = 1;
        }
    }
    getCanvasImageData(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.canvasImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        this.newCanvasImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    getRGBAFromXY(x: number, y: number): Color {
        const data = this.canvasImageData.data;
        const width = this.drawingService.canvas.width;
        const R = data[y * (width * 4) + x * 4];
        const G = data[y * (width * 4) + x * 4 + 1];
        const B = data[y * (width * 4) + x * 4 + 2];
        const A = data[y * (width * 4) + x * 4 + 3];
        const color: Color = { R, G, B, A };
        return color;
    }

    getRGBAFromXYAndIsSameColor(x: number, y: number, color: Color): boolean {
        const data = this.canvasImageData.data;
        const width = this.drawingService.canvas.width;
        const R = data[y * (width * 4) + x * 4];
        const G = data[y * (width * 4) + x * 4 + 1];
        const B = data[y * (width * 4) + x * 4 + 2];
        const A = data[y * (width * 4) + x * 4 + 3];
        const colorFromXY: Color = { R, G, B, A };
        return this.isSameColor(colorFromXY, color, 0.4);
    }

    putRGBAInArray(x: number, y: number, color: Color): void {
        const width = this.drawingService.canvas.width;
        this.newCanvasImageData.data[y * (width * 4) + x * 4] = color.R;
        this.newCanvasImageData.data[y * (width * 4) + x * 4 + 1] = color.G;
        this.newCanvasImageData.data[y * (width * 4) + x * 4 + 2] = color.B;
        this.newCanvasImageData.data[y * (width * 4) + x * 4 + 3] = color.A;
    }

    getArrayPosfromXY(x: number, y: number): number {
        return y * (this.canvasImageData.width * 4) + x * 4;
    }

    setStartColor(event: MouseEvent): void {
        const startPixel = this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        this.startColor.R = startPixel[0];
        this.startColor.G = startPixel[1];
        this.startColor.B = startPixel[2];
        this.startColor.A = startPixel[3];
    }

    setFillColor(): void {
        let str = this.currentColorService.getPrimaryColorRgba();
        str = str.replace(/[^\d,]/g, '');
        const arr = str.split(',');
        this.fillColor.R = +arr[0];
        this.fillColor.G = +arr[1];
        this.fillColor.B = +arr[2];
        const alpha = Math.round(255 * +arr[3]);
        this.fillColor.A = alpha;
    }

    onMouseUp(event: MouseEvent): void {}

    executeCommand(command: ToolCommand): void {}

    isSameColor(colorA: Color, colorB: Color, sensibility: number): boolean {
        const threshold = (1 - sensibility) * 255;
        const R = Math.abs(colorA.R - colorB.R);
        const G = Math.abs(colorA.G - colorB.G);
        const B = Math.abs(colorA.B - colorB.B);
        const A = Math.abs(colorA.A - colorB.A);

        return R < threshold && G < threshold && B < threshold && A < threshold;
        // return Math.round(A1 / B1) > 0.5 || Math.round(A1 / B1) < 1.5;
    }
}
