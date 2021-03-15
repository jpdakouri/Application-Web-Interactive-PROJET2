import { ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { FILE_NAME_REGEX, LABEL_NAME_REGEX } from '@app/services/services-constants';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { Tag } from '@app/utils/interfaces/tag';

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
    tagName: FormControl;
    selectedFormat: string;
    formats: string[];
    tags: Tag[];
    imageFormatsNames: Map<string, ImageFormat>;
    imageData: ImageData;
    originalCanvas: HTMLCanvasElement;
    imageSource: string;
    readonly separatorKeysCodes: number[] = [ENTER];
    waitingForServer: boolean = false;
    currentIndex: number = 0;

    constructor(private saveDrawingService: SaveDrawingService, public dialogRef: MatDialogRef<SaveDrawingComponent>) {
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.tagName = new FormControl('', [Validators.pattern(LABEL_NAME_REGEX)]);
        this.formats = Object.values(ImageFormat);
        this.selectedFormat = ImageFormat.PNG;
        this.tags = [];
    }
    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
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

    getErrorMessageName(): string {
        if (this.fileName.hasError('required')) {
            return 'Vous devez entrer un nom';
        }
        return this.fileName.invalid ? 'Nom de fichier invalide' : '';
    }

    getErrorMessageLabel(): string {
        return this.fileName.invalid ? 'Peut seulement être composé de chiffres, lettres et espaces' : '';
    }

    onFormatChange(selectedFormat: string): void {
        this.saveDrawingService.currentFormat.next(selectedFormat);
    }

    updateService(): void {
        this.saveDrawingService.canvas = this.canvas.nativeElement;
        this.saveDrawingService.fileName = this.fileName.value;
        this.saveDrawingService.selectedFormat = this.selectedFormat;
        this.saveDrawingService.labelsChecked = this.tags;
    }

    updateDrawing(): void {
        this.saveDrawingService.updateDrawing();
    }

    deleteDrawing(): void {
        this.saveDrawingService.deleteDrawing();
    }

    getAllDrawings(): void {
        this.saveDrawingService.getAllDrawings();
    }

    addDrawing(): void {
        this.updateService();
        this.waitingForServer = true;
        this.saveDrawingService.addDrawing();
        this.dialogRef.close();
    }

    // Code for chips inspired by Angular material site
    remove(labelToRemove: Tag): void {
        const indexToRemove = this.tags.indexOf(labelToRemove);

        if (indexToRemove >= 0) this.tags.splice(indexToRemove, 1);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim() && LABEL_NAME_REGEX.test(value)) {
            this.tags.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
}
