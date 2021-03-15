import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.carouselDialog = this.dialog.open(CarouselComponent, {});
    }
}
