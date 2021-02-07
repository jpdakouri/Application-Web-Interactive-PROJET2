import { Injectable } from '@angular/core';
import { Coordinate } from '@app/services/mouse-handler/coordinate';

export const SIDEBAR_WIDTH = 294;

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    // resizingPreviewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    calculateWorkingZoneSize(): Coordinate {
        return {
            x: window.innerWidth - SIDEBAR_WIDTH,
            y: window.innerHeight,
        };
    }

    saveCanvas(width: number, height: number): void {
        sessionStorage.setItem('canvasBuffer', this.canvas.toDataURL());
    }

    restoreCanvas(): void {
        // this.clearCanvas(this.previewCtx); // temp
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
        // console.log('canvas cleared!');
    }

    isCanvasBlank(): boolean {
        // @ts-ignore
        return !this.canvas
            .getContext('2d')
            .getImageData(0, 0, this.canvas.width, this.canvas.height)
            .data.some((channel: number) => channel !== 0);
    }

    // isCanvasBlank(): boolean {
    //     const context = this.canvas.getContext('2d');
    //
    //     // @ts-ignore
    //     const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    //
    //     return !pixelBuffer.some((color) => color !== 0);
    // }
}
