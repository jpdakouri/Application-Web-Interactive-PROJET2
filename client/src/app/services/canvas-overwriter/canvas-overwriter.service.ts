import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasOverwriterService {
    constructor(private drawingService: DrawingService /*, private canvasResizer: CanvasResizerService*/) {}

    overwriteCanvasState(pixels: string[][]): void {
        // TODO: resize le canvas
        for (let i = 0; i < pixels.length; i++) {
            for (let j = 0; j < pixels[0].length; j++) {
                this.drawingService.baseCtx.fillStyle = pixels[j][i];
                this.drawingService.baseCtx.rect(j, i, 1, 1);
            }
        }
    }
}
