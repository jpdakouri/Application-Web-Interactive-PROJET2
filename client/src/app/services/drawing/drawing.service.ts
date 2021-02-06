import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    // resizingPreviewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    saveCanvas(width: number, height: number): void {
        sessionStorage.setItem('canvasBuffer', this.canvas.toDataURL());
    }

    restoreCanvas(): void {
        this.clearCanvas(this.previewCtx); // temp
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
        // @ts-ignore
        return !this.drawingService.canvas
            .getContext('2d')
            .getImageData(0, 0, this.canvas.width, this.canvas.height)
            .data.some((channel: number) => channel !== 0);
    }
}
