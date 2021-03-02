import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { FILE_NAME_REGEX } from '@app/services/services-constants';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('previewCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('tempCanvas', { static: false }) tempCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('link', { static: false }) link: ElementRef<HTMLAnchorElement>;

    imageFiltersNames: Map<string, ImageFilter>;
    imageFormatsNames: Map<string, ImageFormat>;
    filters: string[];
    formats: string[];
    selectedFormat: string;
    selectedFilter: string;
    fileName: FormControl;

    constructor(private exportDrawingService: ExportDrawingService, public dialogRef: MatDialogRef<ExportDrawingComponent>) {
        this.filters = Object.values(ImageFilter);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.selectedFilter = ImageFilter.None;
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.initializeImageFiltersNames();
        this.initializeImageFormatsName();
    }

    ngOnInit(): void {
        this.exportDrawingService.currentFormat.subscribe((format: ImageFormat) => {
            this.selectedFormat = format.toString();
        });

        this.exportDrawingService.currentFilter.subscribe((filter: ImageFilter) => {
            this.selectedFilter = filter.toString();
        });
    }

    ngAfterViewInit(): void {
        this.exportDrawingService.previewCanvas = this.canvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.downloadProcessingCanvas = this.canvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.link = document.createElement('a');
        this.exportDrawingService.drawPreviewImage();
    }

    ngOnDestroy(): void {
        this.exportDrawingService.currentFilter.next(ImageFilter.None);
        this.exportDrawingService.currentFormat.complete();
        this.exportDrawingService.currentFilter.complete();
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

    private initializeImageFormatsName(): void {
        this.imageFormatsNames = new Map<string, ImageFormat>();
        this.imageFormatsNames.set('PNG', ImageFormat.PNG);
        this.imageFormatsNames.set('JPEG', ImageFormat.JPEG);
    }

    getErrorMessage(): string {
        if (this.fileName.hasError('required')) {
            return 'Vous devez entrer un nom';
        }
        return this.fileName.invalid ? 'Nom de fichier invalide' : '';
    }

    onDialogClose(): void {
        this.dialogRef.close();
    }

    onFormatChange(selectedFormat: string): void {
        const newFormat = this.imageFormatsNames.get(selectedFormat);
        if (newFormat !== undefined) {
            this.exportDrawingService.currentFormat.next(newFormat);
        }
    }

    onFilterChange(selectedFilter: string): void {
        const newFilter = this.imageFiltersNames.get(selectedFilter);
        if (newFilter !== undefined) {
            this.exportDrawingService.currentFilter.next(newFilter);
            this.exportDrawingService.drawPreviewImage();
        }
    }

    onDownload(): void {
        this.exportDrawingService.downloadImage(this.fileName.value, this.selectedFormat.toString());
        this.dialogRef.close();
    }
}
