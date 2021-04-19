import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadLinkComponent } from '@app/components/export-drawing/upload-link/upload-link.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ImgurApiService } from '@app/services/imgur-api/imgur-api.service';
import {
    FILE_NAME_REGEX,
    INVALID_FILE_NAME_ERROR_MESSAGE,
    NO_ERROR_MESSAGE,
    REQUIRED_FILE_NAME_ERROR_MESSAGE,
    UPLOAD_FAIL_ERROR_MESSAGE,
    UPLOAD_SNACK_BAR_DISPLAY_DURATION,
} from '@app/services/services-constants';
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
    selectedFilterValue: string;
    fileName: FormControl;
    imageSource: string;
    originalCanvas: HTMLCanvasElement;

    constructor(
        private exportDrawingService: ExportDrawingService,
        private imgurService: ImgurApiService,
        private drawingService: DrawingService,
        public dialogRef: MatDialogRef<ExportDrawingComponent>,
        private snackBar: MatSnackBar,
    ) {
        this.filters = Object.values(ImageFilter);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.selectedFilter = ImageFilter.None;
        this.selectedFilterValue = this.exportDrawingService.imageFilters.get(ImageFilter.None) as string;
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.imageSource = '';
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
        this.originalCanvas = this.drawingService.canvas;
        this.exportDrawingService.canvas = this.downloadProcessingCanvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.link = this.link.nativeElement as HTMLAnchorElement;
        setTimeout(() => {
            this.imageSource = this.originalCanvas.toDataURL('image/png') as string;
        });
    }

    ngOnDestroy(): void {
        this.exportDrawingService.currentFilter.next(ImageFilter.None);
        this.exportDrawingService.currentFilter.complete();
        this.exportDrawingService.currentFormat.complete();
    }

    getErrorMessage(): string {
        if (this.fileName.hasError('required')) {
            return REQUIRED_FILE_NAME_ERROR_MESSAGE;
        }
        return this.fileName.invalid ? INVALID_FILE_NAME_ERROR_MESSAGE : NO_ERROR_MESSAGE;
    }

    onDialogClose(): void {
        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    onFormatChange(selectedFormat: string): void {
        this.exportDrawingService.currentFormat.next(selectedFormat);
    }

    onFilterChange(selectedFilter: string): void {
        this.exportDrawingService.currentFilter.next(selectedFilter);
        this.selectedFilterValue = this.exportDrawingService.imageFilters.get(selectedFilter) as string;
    }

    onDownload(): void {
        this.exportDrawingService.imageSource = this.imageSource;
        this.exportDrawingService.downloadDrawingAsImage(this.fileName.value, this.selectedFormat);
        this.dialogRef.close();
    }

    onUpload(): void {
        this.exportDrawingService.imageSource = this.imageSource;
        const imageSource = this.exportDrawingService.canvasToBase64Image(this.selectedFormat);
        this.imgurService.uploadDrawing(this.fileName.value, imageSource).subscribe(
            (res) => {
                this.snackBar.openFromComponent(UploadLinkComponent, {
                    data: res.data.link,
                    duration: UPLOAD_SNACK_BAR_DISPLAY_DURATION,
                });
            },
            () => {
                this.snackBar.open(UPLOAD_FAIL_ERROR_MESSAGE, 'Fermer', {
                    duration: UPLOAD_SNACK_BAR_DISPLAY_DURATION,
                });
            },
        );
        this.closeDialog();
    }
}
