import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';

@Injectable({
    providedIn: 'root',
})
export class DialogControllerService {
    // tslint:disable-next-line:no-any
    dialogRef: MatDialogRef<any>;
    noDialogOpened: boolean = true;

    constructor(public dialog: MatDialog) {}
    openDialog(component: string): void {
        if (this.noDialogOpened)
            switch (component) {
                case 'carousel':
                    this.dialogRef = this.dialog.open(CarouselComponent, {});
                    this.noDialogOpened = false;
                    break;
                case 'export':
                    this.dialogRef = this.dialog.open(ExportDrawingComponent, {});
                    this.noDialogOpened = false;
                    break;
                case 'save':
                    this.dialogRef = this.dialog.open(SaveDrawingComponent, {});
                    this.noDialogOpened = false;
                    break;
                default:
                    break;
            }
        this.dialogRef.afterClosed().subscribe(() => {
            this.noDialogOpened = true;
        });
    }
}
