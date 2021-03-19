import { Injectable } from '@angular/core';
import { DEFAULT_WHITE } from '@app/services/services-constants';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    imageFilters: Map<string, string>;
    currentFilter: BehaviorSubject<string>;
    currentFormat: BehaviorSubject<string>;
    imageSource: string;
    link: HTMLAnchorElement;
    canvas: HTMLCanvasElement;

    constructor() {
        this.currentFilter = new BehaviorSubject<string>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<string>(ImageFormat.PNG);
        this.imageSource = '';
        this.initializeImageFilters();
    }

    private initializeImageFilters(): void {
        this.imageFilters = new Map<ImageFilter, string>();
        this.imageFilters
            .set(ImageFilter.None, 'none')
            .set(ImageFilter.Blur, 'blur(5px)')
            .set(ImageFilter.Brightness, 'brightness(80%)')
            .set(ImageFilter.BlackAndWhite, 'grayscale(100%)')
            .set(ImageFilter.Contrast, 'contrast(200%)')
            .set(ImageFilter.HueRotate, 'hue-rotate(120deg)')
            .set(ImageFilter.Opacity, 'opacity(50%)')
            .set(ImageFilter.Inversion, 'invert(100%)')
            .set(ImageFilter.Saturation, 'saturate(200%)')
            .set(ImageFilter.Sepia, 'sepia(100%)');
    }

    downloadDrawingAsImage(fileName: string, format: string): void {
        const image = new Image();

        image.src = this.imageSource;
        this.drawImageOnCanvas(image, this.canvas, this.currentFilter.getValue());

        // set the image to image with current filter applied on
        const dataURL = this.canvas.toDataURL(`image/${format}`) as string;
        if (dataURL !== undefined) image.src = dataURL;

        this.link.download = fileName;
        this.link.href = image.src;
        this.link.click();
    }

    private drawImageOnCanvas(image: HTMLImageElement, canvas: HTMLCanvasElement, filter?: string): void {
        if (image === undefined) return;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = image.width;
        canvas.height = image.height;

        // set context background color to white
        context.fillStyle = DEFAULT_WHITE;
        if (filter !== undefined) this.applyFilterOnCanvas(this.currentFilter.getValue(), canvas);
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(image, 0, 0);
    }

    private applyFilterOnCanvas(filter: string, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.filter = this.imageFilters.get(filter) as string;
    }

    // downloadDrawingAsImage v4 fonctionnelle
    // downloadDrawingAsImage(fileName: string, format: string): void {
    //     const image = new Image();
    //     image.src = this.imageSource;
    //     // const canvas = document.createElement('canvas');
    //     const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    //     this.canvas.width = image.width;
    //     this.canvas.height = image.height;
    //     image.onload = () => {
    //         context.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //         context.drawImage(image, 0, 0);
    //         this.link.download = fileName;
    //         this.link.href = image.src;
    //         this.link.click();
    //     };
    //     image.src = this.canvas.toDataURL(`image/${format}`);
    //     console.log(context.filter);
    // }
}
