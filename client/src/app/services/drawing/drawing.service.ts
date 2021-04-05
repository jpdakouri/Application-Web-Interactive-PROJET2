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
    selectedAreaCanvas: HTMLCanvasElement;
    @Output() newDrawing: EventEmitter<Vec2> = new EventEmitter();
    @Output() createNewDrawingEmitter: EventEmitter<boolean> = new EventEmitter();

    saveCanvas(): void {
        console.log('save');
        const value = [];
        value.push(this.canvas.toDataURL());
        value.push(this.canvas.width);
        value.push(this.canvas.height);
        localStorage.setItem('canvasInfo', JSON.stringify(value));
    }

    restoreCanvas(): void {
        console.log('restore');
        const canvasInfo = localStorage.getItem('canvasInfo');
        const info = JSON.parse(canvasInfo as string);
        // console.log(canvasInfo);
        if (info[0]) {
            const drawingData: DrawingData = new DrawingData('', '', [], info[0], info[1], info[2]);
            // this.openDrawing(drawingData, false);
            const img = new Image();
            img.onload = () => {
                this.canvas.getContext('2d')?.drawImage(img, 0, 0);
            };
            img.src = drawingData.dataURL as string;
            this.newDrawing.emit({ x: drawingData.width, y: drawingData.height } as Vec2);
            this.saveCanvas();
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
        console.log('openD');
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
        console.log('clearDrawing');
        if (localStorage.getItem('canvasInfo') && !this.isCanvasBlank() && showConfirmDialog) {
            if (confirm("Le canvas n'est pas vide! Voulez-vous procéder tout de même?")) {
                this.clearCanvas(this.previewCtx);
                this.clearCanvas(this.baseCtx);
                // this.emitCreateNewDrawing();
                localStorage.clear();
                return true;
            } else if (localStorage.getItem('canvasInfo') && !this.isCanvasBlank()) {
                this.clearCanvas(this.previewCtx);
                this.clearCanvas(this.baseCtx);
                // this.emitCreateNewDrawing();
                localStorage.clear();
                return true;
            }
        }
        return false;
    }

    continueDrawing(): void {
        console.log('conti');
        if (!this.isCanvasBlank() && localStorage.getItem('canvasInfo')) {
            const dataURL = localStorage.getItem('canvasInfo');
            const image = new Image();
            image.src = dataURL as string;

            if (dataURL) {
                const drawingData: DrawingData = new DrawingData('', '', [], dataURL, this.canvas.width, this.canvas.height);
                const img = new Image();
                img.onload = () => {
                    this.canvas.getContext('2d')?.drawImage(img, 0, 0);
                };
                img.src = drawingData.dataURL as string;
                this.newDrawing.emit({ x: drawingData.width, y: drawingData.height } as Vec2);
                this.saveCanvas();
            }
            this.restoreCanvas();
        }
    }

    emitCreateNewDrawing(): void {
        this.createNewDrawingEmitter.emit(true);
    }

    // emitContinuerawing(): void {
    //     this.createNewDrawingEmitter.emit(true);
    // }
}
