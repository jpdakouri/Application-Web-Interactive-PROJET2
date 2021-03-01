import { Injectable } from '@angular/core';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    previewCanvas: HTMLCanvasElement;
    previewImage: HTMLImageElement;
    drawingTitle: string;
    imageFilters: Map<ImageFilter, string>;
    imageFormats: Map<ImageFormat, string>;
    currentFilter: BehaviorSubject<ImageFilter>;
    currentFormat: BehaviorSubject<ImageFormat>;

    constructor() {
        this.currentFilter = new BehaviorSubject<ImageFilter>(ImageFilter.None);
        this.currentFormat = new BehaviorSubject<ImageFormat>(ImageFormat.PNG);
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

    convertCanvasToImage(canvas: HTMLCanvasElement): HTMLImageElement {
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        console.log(image.src);
        return image;
    }

    drawPreviewImage(): void {
        const context = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

        context.filter = this.imageFilters.get(this.currentFilter.value) as string;
        const dataURL = sessionStorage.getItem('canvasBuffer');
        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            this.previewImage = image;
            image.onload = () => {
                // get the scale
                const scale = Math.min(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
                // const scale = Math.max(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
                // get the top left position of the image
                const x = this.previewCanvas.width / 2 - (image.width / 2) * scale;
                const y = this.previewCanvas.height / 2 - (image.height / 2) * scale;
                context.drawImage(image, x, y, image.width * scale, image.height * scale);
                // context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
            };
        }
        this.currentFilter.next(ImageFilter.None);
    }

    exportImage(): void {}

    downloadImage(fileName: string, format: string): void {
        // let image: string;
        // image = this.canvas.nativeElement
        //     .toDataURL(`image/${this.selectedFormat}`)
        //     .replace(`image/${this.selectedFormat}`, 'image/octet-stream');
        // image = this.canvas.nativeElement.toDataURL(`image/${this.selectedFormat}`).replace('image/png', 'image/octet-stream');

        const image = new Image();
        // image.src = this.previewImage.src;
        image.src = this.previewCanvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = image.src;
        link.click();
    }
}
