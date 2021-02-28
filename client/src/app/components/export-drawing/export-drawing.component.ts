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

    selectedFormat: string;
    selectedFilter: string;
    filters: string[];
    formats: string[];

    constructor(private exportDrawingService: ExportDrawingService, public dialogRef: MatDialogRef<ExportDrawingComponent>) {
        this.filters = Object.values(ImageFilter);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.selectedFilter = ImageFilter.None;
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.exportDrawingService.previewCanvas = this.canvas.nativeElement as HTMLCanvasElement;
        this.exportDrawingService.drawPreviewImage();
    }

    ngOnDestroy(): void {}

    exportDrawing(): void {}

    onDialogClose(): void {
        this.dialogRef.close();
    }

    onDownload(): void {
        this.exportDrawingService.exportImage();
        this.onDialogClose();
    }

    onFormatChange(): void {}

    onFilterChange(): void {}
}
