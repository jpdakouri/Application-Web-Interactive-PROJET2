import { EventEmitter, Injectable, Output } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    selectedAreaCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    gridSize: number;
    selectedAreaCanvas: HTMLCanvasElement;
    @Output() newDrawing: EventEmitter<Vec2> = new EventEmitter();
    @Output() createNewDrawingEmitter: EventEmitter<boolean> = new EventEmitter();

    saveCanvas(): void {
        const value = [];
        value.push(this.canvas.toDataURL());
        value.push(this.canvas.width);
        value.push(this.canvas.height);
        localStorage.setItem('canvasInfo', JSON.stringify(value));
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    getBaseContext(): CanvasRenderingContext2D {
        return this.baseCtx;
    }

    getPreviewContext(): CanvasRenderingContext2D {
        return this.previewCtx;
    }

    restoreCanvas(): void {
        const canvasInfo = localStorage.getItem('canvasInfo');
        const info = JSON.parse(canvasInfo as string);
        if (info[0]) {
            const drawingData: DrawingData = new DrawingData('', '', [], info[0], info[1], info[2]);
            const img = new Image();
            img.onload = () => {
                this.canvas.getContext('2d')?.drawImage(img, 0, 0);
            };
            img.src = drawingData.dataURL as string;
            this.newDrawing.emit({ x: drawingData.width, y: drawingData.height } as Vec2);
        }
        this.saveCanvas();
    }

    restoreDrawing(): void {
        const canvasInfo = localStorage.getItem('canvasInfo');
        const info = JSON.parse(canvasInfo as string);
        const dataURL = info[0];
        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            image.onload = () => {
                this.baseCtx.drawImage(image, 0, 0);
                this.previewCtx.drawImage(image, 0, 0);
            };
        }
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isCanvasBlank(): boolean {
        if (this.baseCtx == undefined) return true;
        const pixelBuffer = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        const hasSomeColoredPixels = pixelBuffer.some((channel: number) => channel !== 0);
        return !hasSomeColoredPixels;
    }

    openDrawing(drawing: DrawingData, showConfirmDialog?: boolean): void {
        this.createNewDrawing(showConfirmDialog);
        this.canvas.width = drawing.width;
        this.canvas.height = drawing.height;
        this.previewCtx.canvas.width = drawing.width;
        this.previewCtx.canvas.height = drawing.height;
        const img = new Image();
        img.onload = () => {
            this.canvas.getContext('2d')?.drawImage(img, 0, 0);
        };
        img.src = drawing.dataURL as string;
        this.newDrawing.emit({ x: drawing.width, y: drawing.height } as Vec2);
        this.saveCanvas();
    }

    createNewDrawing(showConfirmDialog?: boolean): boolean {
        if (localStorage.getItem('canvasInfo') && !this.isCanvasBlank() && showConfirmDialog) {
            if (confirm("Le canvas n'est pas vide! Voulez-vous procéder tout de même?")) {
                this.clearCanvas(this.previewCtx);
                this.clearCanvas(this.baseCtx);
                this.saveCanvas();
                localStorage.clear();
                this.emitCreateNewDrawing();
                return true;
            } else if (localStorage.getItem('canvasInfo') && !this.isCanvasBlank()) {
                this.continueDrawing();
                this.saveCanvas();
                return true;
            }
        }

        return false;
    }

    continueDrawing(): void {
        if (!this.isCanvasBlank() && localStorage.getItem('canvasInfo')) {
            const dataURL = localStorage.getItem('canvasInfo');
            const image = new Image();
            image.src = dataURL as string;
            if (dataURL) {
                this.restoreCanvas();
                this.restoreDrawing();
            }
        }
    }

    emitCreateNewDrawing(): void {
        this.createNewDrawingEmitter.emit(true);
    }
}
