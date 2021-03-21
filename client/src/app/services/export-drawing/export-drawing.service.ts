import { ElementRef, Injectable } from '@angular/core';
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
    link: HTMLAnchorElement;
    imageSource: string;
    image: ElementRef<HTMLImageElement>;
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
            .set(ImageFilter.Contrast, 'contrast(200%)')
            .set(ImageFilter.Opacity, 'opacity(50%)')
            .set(ImageFilter.Inversion, 'invert(100%)')
            .set(ImageFilter.BlackAndWhite, 'grayscale(100%)')
            .set(ImageFilter.Saturation, 'saturate(200%)')
            .set(ImageFilter.Sepia, 'sepia(100%)');
    }

    downloadImage(fileName: string, format: string): void {
        const image = new Image();
        image.src = this.imageSource;
        const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        context.filter = this.imageFilters.get(this.currentFilter.value) as string;
        context.drawImage(image, 0, 0);
        image.src = this.canvas.toDataURL(`image/${format}`);
        this.link.download = fileName;
        this.link.href = image.src;
        this.link.click();
    }
}
