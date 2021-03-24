import { EventEmitter, Injectable, Output } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    selectedAreaCtx: CanvasRenderingContext2D;
    selectedAreaCanvas: HTMLCanvasElement;
    @Output() newDrawing: EventEmitter<Vec2> = new EventEmitter();
    @Output() createNewDrawingEmitter: EventEmitter<boolean> = new EventEmitter();

    saveCanvas(): void {
        sessionStorage.setItem('canvasBuffer', this.canvas.toDataURL());
    }

    restoreCanvas(): void {
        const dataURL = sessionStorage.getItem('canvasBuffer');
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

    openDrawing(drawing: DrawingData): void {
        this.createNewDrawing();
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

    createNewDrawing(): boolean {
        if (sessionStorage.getItem('canvasBuffer') && !this.isCanvasBlank()) {
            if (confirm("Le canvas n'est pas vide! Voulez-vous procéder tout de même?")) {
                this.clearCanvas(this.previewCtx);
                this.clearCanvas(this.baseCtx);
                this.emitCreateNewDrawing();
                sessionStorage.clear();
                return true;
            }
        }
        return false;
    }

    emitCreateNewDrawing(): void {
        this.createNewDrawingEmitter.emit(true);
    }
}
