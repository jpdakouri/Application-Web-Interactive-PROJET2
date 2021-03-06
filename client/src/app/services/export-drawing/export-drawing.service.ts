import { Injectable } from '@angular/core';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    imageFilters: Map<string, string>;
    imageFormats: Map<string, string>;
    currentFilter: BehaviorSubject<string>;
    currentFormat: BehaviorSubject<string>;
    previewCanvas: HTMLCanvasElement;
    originalCanvas: HTMLCanvasElement;
    downloadProcessingCanvas: HTMLCanvasElement;
    link: HTMLAnchorElement;

    constructor() {
        this.currentFilter = new BehaviorSubject<string>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<string>(ImageFormat.PNG);
        // this.originalCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.link = document.createElement('a');
        // this.downloadProcessingCanvas = this.originalCanvas;
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

    // drawPreviewImage v2
    drawPreviewImage(): void {
        const previewContext = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        const image = this.convertCanvasToImage(this.originalCanvas, ImageFormat.PNG);

        previewContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        previewContext.filter = this.imageFilters.get(this.currentFilter.value) as string;
        console.log(previewContext.filter);

        image.onload = () => {
            // get the scale
            const scale = Math.min(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
            // get the top left position of the image
            const x = this.previewCanvas.width / 2 - (image.width / 2) * scale;
            const y = this.previewCanvas.height / 2 - (image.height / 2) * scale;
            previewContext.drawImage(image, x, y, image.width * scale, image.height * scale);
        };
    }

    // downloadImage v2
    downloadImage(fileName: string, format: string): void {
        const context = this.downloadProcessingCanvas.getContext('2d') as CanvasRenderingContext2D;

        let image = this.convertCanvasToImage(this.originalCanvas, format);
        image.onload = () => {
            // this.downloadProcessingCanvas.width = this.originalCanvas.width;
            // this.downloadProcessingCanvas.height = this.originalCanvas.height;
            context.filter = this.imageFilters.get(this.currentFilter.value) as string;
            console.log(context.filter);
            context.drawImage(image, 0, 0);
        };
        // set image source to original image with current filter applied on
        image = this.convertCanvasToImage(this.downloadProcessingCanvas, format);

        this.link.download = fileName;
        this.link.href = image.src;
        this.link.click();
    }

    private convertCanvasToImage(canvas: HTMLCanvasElement, format: string): HTMLImageElement {
        const image = new Image();
        const dataURL = canvas.toDataURL(`image/${format}`);
        if (dataURL) {
            image.src = dataURL;
            image.onload = () => {
                image.width = canvas.width;
                image.height = canvas.height;
            };
        }
        return image;
    }

    // drawPreviewImage(): void {
    //     const previewContext = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     const dataURL = this.originalCanvas.toDataURL(ImageFormat.PNG);
    //
    //     previewContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    //     // previewContext.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //     previewContext.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //     console.log(previewContext.filter);
    //
    //     const image = new Image();
    //     if (dataURL) {
    //         image.src = dataURL;
    //         image.onload = () => {
    //             // get the scale
    //             const scale = Math.min(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
    //             // get the top left position of the image
    //             const x = this.previewCanvas.width / 2 - (image.width / 2) * scale;
    //             const y = this.previewCanvas.height / 2 - (image.height / 2) * scale;
    //             previewContext.drawImage(image, x, y, image.width * scale, image.height * scale);
    //         };
    //     }
    // }

    // TODO : Extract dataUrl in a method
    // downloadImage(fileName: string, format: string): void {
    //     // const link = document.createElement('a');
    //     const context = this.downloadProcessingCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     // context.clearRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
    //
    //     const image = new Image();
    //     const dataURL = this.originalCanvas.toDataURL(`image/${format}`);
    //     if (dataURL) {
    //         image.src = dataURL;
    //         image.onload = () => {
    //             // this.downloadProcessingCanvas.width = this.originalCanvas.width;
    //             // this.downloadProcessingCanvas.height = this.originalCanvas.height;
    //             context.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //             console.log(context.filter);
    //             context.drawImage(image, 0, 0);
    //         };
    //         // set image source to original image with current filter applied on
    //         image.src = this.downloadProcessingCanvas.toDataURL(`image/${format}`);
    //
    //         this.link.download = fileName;
    //         this.link.href = image.src;
    //         this.link.click();
    //     }
    // }
}
