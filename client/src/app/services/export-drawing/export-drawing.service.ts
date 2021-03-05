import { Injectable } from '@angular/core';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    imageFilters: Map<ImageFilter, string>;
    imageFormats: Map<ImageFormat, string>;
    currentFilter: BehaviorSubject<ImageFilter>;
    currentFormat: BehaviorSubject<ImageFormat>;
    previewCanvas: HTMLCanvasElement;
    originalCanvas: HTMLCanvasElement;
    downloadProcessingCanvas: HTMLCanvasElement;
    link: HTMLAnchorElement;

    constructor() {
        this.currentFilter = new BehaviorSubject<ImageFilter>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<ImageFormat>(ImageFormat.PNG);
        this.originalCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.initializeImageFilters();
        this.initializeImageFormats();
    }

    private initializeImageFilters(): void {
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

    private initializeImageFormats(): void {
        this.imageFormats = new Map<ImageFormat, string>();
        this.imageFormats.set(ImageFormat.PNG, 'PNG');
        this.imageFormats.set(ImageFormat.JPEG, 'JPEG');
    }

    private convertCanvasToImage(canvas: HTMLCanvasElement): HTMLImageElement {
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        console.log(image.src);
        return image;
    }

    drawPreviewImage(): void {
        const previewContext = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        const dataURL = this.originalCanvas.toDataURL(ImageFormat.PNG);

        previewContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        previewContext.filter = this.imageFilters.get(this.currentFilter.value) as string;

        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            image.onload = () => {
                // get the scale
                const scale = Math.min(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
                // get the top left position of the image
                const x = this.previewCanvas.width / 2 - (image.width / 2) * scale;
                const y = this.previewCanvas.height / 2 - (image.height / 2) * scale;
                previewContext.drawImage(image, x, y, image.width * scale, image.height * scale);
            };
        }
    }

    // TODO : Extract dataUrl in a method
    downloadImage(fileName: string, format: string): void {
        const context = this.downloadProcessingCanvas.getContext('2d') as CanvasRenderingContext2D;
        const image = this.convertCanvasToImage(this.originalCanvas);

        if (image) {
            context.filter = this.imageFilters.get(this.currentFilter.value) as string;
            image.onload = () => {
                this.downloadProcessingCanvas.width = this.originalCanvas.width;
                this.downloadProcessingCanvas.height = this.originalCanvas.height;
                context.drawImage(image, 0, 0);
            };
            // set image source to original image with current filter applied on
            image.src = this.downloadProcessingCanvas.toDataURL(`image/${format}`);

            this.link.download = fileName;
            this.link.href = image.src;
            this.link.click();
        }
    }

    // downloadImage(fileName: string, format: string): void {
    //     // const context = this.downloadProcessingCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     const context = this.downloadProcessingCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     const image = new Image();
    //
    //     this.downloadProcessingCanvas.width = this.previewImage.width;
    //     this.downloadProcessingCanvas.height = this.previewImage.height;
    //     context.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //
    //     context.drawImage(this.previewImage, 0, 0);
    //     image.src = this.downloadProcessingCanvas.toDataURL(`image/${format}`);
    //
    //     this.link.download = fileName;
    //     this.link.href = image.src;
    //     this.link.click();
    // }
}
