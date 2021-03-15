import { ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { FILE_NAME_REGEX, TAG_NAME_REGEX } from '@app/services/services-constants';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { Tag } from '@app/utils/interfaces/tag';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements AfterViewInit {
    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;

    fileName: FormControl;
    tagName: FormControl;
    selectedFormat: string;
    tags: Tag[];
    originalCanvas: HTMLCanvasElement;
    imageSource: string;
    readonly separatorKeysCodes: number[] = [ENTER];
    waitingForServer: boolean = false;
    currentIndex: number = 0;

    constructor(private saveDrawingService: SaveDrawingService, public dialogRef: MatDialogRef<SaveDrawingComponent>) {
        this.fileName = new FormControl('', [Validators.required, Validators.pattern(FILE_NAME_REGEX)]);
        this.tagName = new FormControl('', [Validators.pattern(TAG_NAME_REGEX)]);
        this.selectedFormat = ImageFormat.PNG;
        this.tags = [];
    }

    ngAfterViewInit(): void {
        this.originalCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        setTimeout(() => {
            if (this.originalCanvas) {
                this.imageSource = this.originalCanvas.toDataURL('image/png') as string;
            }
        });
    }

    onDialogClose(): void {
        this.dialogRef.close();
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

    updateService(): void {
        this.saveDrawingService.originalCanvas = this.originalCanvas;
        this.saveDrawingService.image = this.previewImage;
        this.saveDrawingService.fileName = this.fileName.value;
        this.saveDrawingService.labelsChecked = this.tags;
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

    addChip(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim() && TAG_NAME_REGEX.test(value)) {
            this.tags.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
}
