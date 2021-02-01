import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    saveCanvas(width: number, height: number): void {
        localStorage.setItem('canvasBuffer', this.canvas.toDataURL());
    }

    restoreCanvas(): void {
        const dataURL = localStorage.getItem('canvasBuffer');
        localStorage.removeItem('canvasBuffer');
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
}
