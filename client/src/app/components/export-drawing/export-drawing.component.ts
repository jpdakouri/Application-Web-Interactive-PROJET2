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
    @ViewChild('link', { static: false }) link: ElementRef<HTMLAnchorElement>;
    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;
    @ViewChild('downloadProcessingCanvas', { static: false }) downloadProcessingCanvas: ElementRef<HTMLCanvasElement>;

    filters: string[];
    formats: string[];
    selectedFormat: string;
    selectedFilter: string;
    fileName: FormControl;
    imageSource: string;
    originalCanvas: HTMLCanvasElement;
    selectedFilterValue: string;

    constructor(private exportDrawingService: ExportDrawingService, public dialogRef: MatDialogRef<ExportDrawingComponent>) {
        this.filters = Object.values(ImageFilter);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.selectedFilter = ImageFilter.None;
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.imageSource = '';
        this.selectedFilterValue = 'none';
    }

    ngOnInit(): void {
        this.exportDrawingService.currentFormat.subscribe((format: string) => {
            this.selectedFormat = format;
        });

        this.exportDrawingService.currentFilter.subscribe((filter: string) => {
            this.selectedFilter = filter;
        });
    }

    ngAfterViewInit(): void {
        this.originalCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.exportDrawingService.canvas = this.downloadProcessingCanvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.link = this.link.nativeElement as HTMLAnchorElement;
        setTimeout(() => {
            if (this.originalCanvas) {
                this.imageSource = this.originalCanvas.toDataURL('image/png') as string;
            }
        });
    }

    ngOnDestroy(): void {
        this.exportDrawingService.currentFilter.next(ImageFilter.None);
        this.exportDrawingService.currentFormat.complete();
        this.exportDrawingService.currentFilter.complete();
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
        if (selectedFormat !== null) {
            this.exportDrawingService.currentFormat.next(selectedFormat);
        }
    }

    onFilterChange(selectedFilter: string): void {
        if (selectedFilter !== null) {
            this.exportDrawingService.currentFilter.next(selectedFilter);
            this.selectedFilterValue = this.exportDrawingService.imageFilters.get(selectedFilter) as string;
        }
    }

    onDownload(): void {
        this.exportDrawingService.image = this.previewImage;
        this.exportDrawingService.imageSource = this.imageSource;
        this.exportDrawingService.downloadImage(this.fileName.value, this.selectedFormat);
        this.dialogRef.close();
    }
}
