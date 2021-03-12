import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { FILE_NAME_REGEX } from '@app/services/services-constants';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { ImageLabels } from '@app/utils/enums/image-labels';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('previewCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('tempCanvas', { static: false }) tempCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('link', { static: false }) link: ElementRef<HTMLAnchorElement>;

    fileName: FormControl;
    selectedFormat: string;
    formats: string[];
    labels: string[];
    labelsChecked: string[];
    imageFormatsNames: Map<string, ImageFormat>;
    imageData: ImageData;
    originalCanvas: HTMLCanvasElement;
    imageSource: string;
    waitingForServer: boolean = false;

    constructor(private saveDrawingService: SaveDrawingService, public dialogRef: MatDialogRef<SaveDrawingComponent>) {
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.formats = Object.values(ImageFormat);
        this.labels = Object.values(ImageLabels);
        this.selectedFormat = ImageFormat.PNG;
    }

    ngOnInit(): void {
        this.saveDrawingService.currentFormat.subscribe((format: ImageFormat) => {
            this.selectedFormat = format.toString();
        });
    }

    ngAfterViewInit(): void {
        this.saveDrawingService.previewCanvas = this.canvas.nativeElement as HTMLCanvasElement;
        this.saveDrawingService.drawPreviewImage();
    }

    ngOnDestroy(): void {
        this.saveDrawingService.currentFormat.complete();
    }

    getErrorMessage(): string {
        if (this.fileName.hasError('required')) {
            return 'Vous devez entrer un nom';
        }
        return this.fileName.invalid ? 'Nom de fichier invalide' : '';
    }

    onFormatChange(selectedFormat: string): void {
        this.saveDrawingService.currentFormat.next(selectedFormat);
    }

    updateService(): void {
        this.saveDrawingService.canvas = this.canvas.nativeElement;
        this.saveDrawingService.fileName = this.fileName.value;
        this.saveDrawingService.selectedFormat = this.selectedFormat;
        this.saveDrawingService.labelsChecked = this.labelsChecked;
    }

    loadToServer(): void {
        this.updateService();
        this.waitingForServer = true;
        this.saveDrawingService.addDrawing().subscribe();
        this.dialogRef.close();
    }
}
