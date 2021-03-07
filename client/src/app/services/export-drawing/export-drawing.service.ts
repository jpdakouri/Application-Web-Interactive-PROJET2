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

    constructor() {
        this.currentFilter = new BehaviorSubject<string>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<string>(ImageFormat.PNG);
        this.link = document.createElement('a');
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

    // // downloadImage v2 - fonctionnelle partiellement
    // downloadImage(fileName: string, format: string): void {
    //     const image = new Image();
    //     image.src = this.imageSource;
    //     const canvas = document.createElement('canvas');
    //     canvas.width = image.width;
    //     canvas.height = image.height;
    //     const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     image.onload = () => {
    //         context.filter = this.imageFilters.get(this.currentFilter.value) as string;
    //         context.drawImage(image, 0, 0);
    //         image.src = canvas.toDataURL(`image/${format}`);
    //         // const image = this.image.nativeElement as HTMLImageElement;
    //
    //         console.log(image.style.filter);
    //         // image.style.filter = 'sepia(100%)';
    //         this.link.download = fileName;
    //         this.link.href = image.src;
    //         this.link.click();
    //     };
    // }

    // downloadImage v2
    downloadImage(fileName: string, format: string): void {
        let temp = '';
        const image = new Image();
        image.src = this.imageSource;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = image.width;
        canvas.height = image.height;
        // image.onload = () => {
        context.filter = this.imageFilters.get(this.currentFilter.value) as string;
        context.drawImage(image, 0, 0);
        image.src = canvas.toDataURL(`image/${format}`);
        temp = image.src;
        // };
        console.log(context.filter);
        this.link.download = fileName;
        this.link.href = temp;
        this.link.click();
    }

    // downloadImage v3
    // downloadImage(fileName: string, format: string): void {
    //     const image = this.image.nativeElement as HTMLImageElement;
    //
    //     console.log(image.style.filter);
    //     // image.style.filter = 'sepia(100%)';
    //     image.onload = () => {
    //         image.style.filter = 'blur(5px)';
    //     };
    //     this.link.download = fileName;
    //     this.link.href = image.src;
    //     this.link.click();
    // }

    // downloadImage(fileName: string, format: string): void {
    //     const image = new Image();
    //     image.src = this.imageSource;
    //
    //     // image.style.filter = 'sepia(100%)';
    //     this.link.download = fileName;
    //     this.link.href = image.src;
    //     this.link.click();
    // }
}
