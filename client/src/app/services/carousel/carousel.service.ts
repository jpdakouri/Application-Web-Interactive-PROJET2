import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;
    drawingArray: DrawingData[] = [
        {
            id: undefined,
            title: 'TEST!',
            tags: ['asd', 'dsa'],
        },
        {
            id: undefined,
            title: 'YEEEE',
            tags: ['asfadsfaddasdsadsdafd', 'dsa'],
        },
        {
            id: undefined,
            title: 'ytre',
            tags: ['none'],
        },
    ] as DrawingData[];

    constructor(public dialog: MatDialog, public carouselComponent: CarouselComponent) {
        carouselComponent.drawingToShow = this.drawingArray;
    }

    openDialog(): void {
        this.carouselDialog = this.dialog.open(CarouselComponent, {});
    }
}
