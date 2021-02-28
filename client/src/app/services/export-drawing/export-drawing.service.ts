import { Injectable } from '@angular/core';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    previewCanvas: HTMLCanvasElement;
    drawingTitle: string;
    currentFilter: ImageFilter;
    currentFormat: ImageFormat;

    constructor() {
        this.currentFilter = ImageFilter.None;
        this.currentFormat = ImageFormat.JPEG;
    }

    convertCanvasToImage(canvas: HTMLCanvasElement): HTMLImageElement {
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        console.log(image.src);
        return image;
    }

    drawPreviewImage(): void {
        const context = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        // context.filter = 'sepia()';
        // context.filter = 'blur(1px)';
        const dataURL = sessionStorage.getItem('canvasBuffer');
        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            // tslint:disable-next-line:no-magic-numbers
            context.scale(0.7, 0.7);
            // image.style.filter = 'blur(5px)';
            image.onload = () => {
                context.drawImage(image, 0, 0);
            };
        }
    }

    exportImage(): void {}
}
