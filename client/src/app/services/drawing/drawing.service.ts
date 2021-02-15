import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

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
        const pixelBuffer = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        const hasSomeColoredPixels = pixelBuffer.some((channel: number) => channel !== 0);
        return !hasSomeColoredPixels;
    }

    createNewDrawing(): void {
        if (sessionStorage.getItem('canvasBuffer') && !this.isCanvasBlank()) {
            if (!confirm("Le canvas n'est pas vide! Voulez-vous garder vos modifications?")) {
                this.clearCanvas(this.previewCtx);
                this.clearCanvas(this.baseCtx);
                sessionStorage.clear();
            }
        }
    }
}
