import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';

@Injectable({
    providedIn: 'root',
})
export class DialogControllerService {
    constructor(public dialog: MatDialog) {}
    openDialog(component: string): void {
        switch (component) {
            case 'carousel':
                this.dialog.open(CarouselComponent, {});
                break;
            case 'export':
                this.dialog.open(ExportDrawingComponent, {});
                break;
            case 'save':
                this.dialog.open(SaveDrawingComponent, {});
                break;
            default:
                break;
        }
    }
}
