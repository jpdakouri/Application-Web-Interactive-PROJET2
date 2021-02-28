import { Injectable } from '@angular/core';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    previewCanvas: HTMLCanvasElement;
    drawingTitle: string;
    imageFilters: Map<ImageFilter, string>;
    imageFormats: Map<ImageFormat, string>;
    currentFilter: BehaviorSubject<ImageFilter>;
    currentFormat: BehaviorSubject<ImageFormat>;

    constructor() {
        this.currentFilter = new BehaviorSubject<ImageFilter>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<ImageFormat>(ImageFormat.JPEG);
        this.initializeImageFiltersMap();
    }

    private initializeImageFiltersMap(): void {
        this.imageFilters = new Map<ImageFilter, string>();
        this.imageFilters.set(ImageFilter.None, 'none');
        this.imageFilters.set(ImageFilter.Blur, 'blur(5px)');
        this.imageFilters.set(ImageFilter.Brightness, 'brightness(80%)');
        this.imageFilters.set(ImageFilter.Contrast, 'contrast(200%)');
        this.imageFilters.set(ImageFilter.Opacity, 'opacity(50%)');
        this.imageFilters.set(ImageFilter.Inversion, 'invert(100%)');
        this.imageFilters.set(ImageFilter.BlackAndWhite, 'grayscale(100%)');
        this.imageFilters.set(ImageFilter.Saturation, 'saturate(200%)');
        this.imageFilters.set(ImageFilter.Sepia, 'sepia(100%)');
    }

    convertCanvasToImage(canvas: HTMLCanvasElement): HTMLImageElement {
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        console.log(image.src);
        return image;
    }

    drawPreviewImage(): void {
        const context = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

        // @ts-ignore
        context.filter = this.imageFilters.get(this.currentFilter.value);
        // this.applyFilterToPreviewImage(context, this.currentFilter);
        const dataURL = sessionStorage.getItem('canvasBuffer');
        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            // context.scale(0.7, 0.7);
            // image.style.filter = 'blur(5px)';
            image.onload = () => {
                context.drawImage(image, 0, 0);
            };
        }
    }

    // applyFilterToPreviewImage(ctx: CanvasRenderingContext2D, filter: ImageFilter): void {
    //     if (filter !== undefined) {
    //         // @ts-ignore
    //         ctx.filter = this.imageFiltersNames.get(filter);
    //     }
    // }

    exportImage(): void {}
}
