import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('previewCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    imageFiltersNames: Map<string, ImageFilter>;
    imageFormatsNames: Map<string, ImageFormat>;
    selectedFormat: string;
    selectedFilter: string;
    filters: string[];
    formats: string[];

    constructor(private exportDrawingService: ExportDrawingService, public dialogRef: MatDialogRef<ExportDrawingComponent>) {
        this.filters = Object.values(ImageFilter);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.selectedFilter = ImageFilter.None;
        this.initializeImageFiltersNames();
    }

    private initializeImageFiltersNames(): void {
        this.imageFiltersNames = new Map<string, ImageFilter>();
        this.imageFiltersNames.set('Aucun filtre', ImageFilter.None);
        this.imageFiltersNames.set('Contraste', ImageFilter.Contrast);
        this.imageFiltersNames.set('Luminosité', ImageFilter.Brightness);
        this.imageFiltersNames.set('Flou', ImageFilter.Blur);
        this.imageFiltersNames.set('Opacité', ImageFilter.Opacity);
        this.imageFiltersNames.set('Nuance de gris', ImageFilter.BlackAndWhite);
        this.imageFiltersNames.set('Inversion', ImageFilter.Inversion);
        this.imageFiltersNames.set('Saturation des couleurs', ImageFilter.Saturation);
        this.imageFiltersNames.set('Sépia', ImageFilter.Sepia);
    }

    ngOnInit(): void {
        this.exportDrawingService.currentFormat.subscribe((format: ImageFormat) => {
            this.selectedFormat = format.toString();
        });

        this.exportDrawingService.currentFilter.subscribe((filter: ImageFilter) => {
            this.selectedFilter = filter.toString();
        });
        console.log('suscribed');
    }

    ngAfterViewInit(): void {
        this.exportDrawingService.previewCanvas = this.canvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.drawPreviewImage();
    }

    ngOnDestroy(): void {
        // this.exportDrawingService.currentFormat.unsubscribe();
        // this.exportDrawingService.currentFilter.unsubscribe();
        // console.log('unsuscribed');
    }

    exportDrawing(): void {}

    onDialogClose(): void {
        this.dialogRef.close();
    }

    onDownload(): void {
        this.exportDrawingService.exportImage();
        this.onDialogClose();
    }

    onFormatChange(selectedFormat: string): void {}

    onFilterChange(selectedFilter: string): void {
        const newFilter = this.imageFiltersNames.get(selectedFilter);
        if (newFilter !== undefined) {
            this.exportDrawingService.currentFilter.next(newFilter);
            this.exportDrawingService.drawPreviewImage();
            console.log(this.exportDrawingService.currentFilter.value);
        }
    }
}
