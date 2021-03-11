import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasOverwriterService {
    constructor(private drawingService: DrawingService /*, private canvasResizer: CanvasResizerService*/) {}

    overwriteCanvasState(pixels: string[][]): void {
        // TODO: resize le canvas
        console.log(pixels);
        for (let i = 0; i < Math.floor(pixels.length - 1); i++) {
            for (let j = 0; j < Math.floor(pixels[0].length); j++) {
                this.drawingService.baseCtx.fillStyle = pixels[j][i];
                this.drawingService.baseCtx.rect(j, i, 1, 1);
            }
        }
    }
}
