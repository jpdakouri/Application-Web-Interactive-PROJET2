import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAX_HEIGHT_MAIN_CARD, MAX_HEIGHT_SIDE_CARD, MAX_WIDTH_MAIN_CARD, MAX_WIDTH_SIDE_CARD } from '@app/components/components-constants';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';
@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    sideCard: CardStyle;
    mainCard: CardStyle;
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

    constructor(public dialogRef: MatDialogRef<CarouselComponent>) {
        this.sideCard = {
            maxWidth: MAX_WIDTH_SIDE_CARD,
            maxHeight: MAX_HEIGHT_SIDE_CARD,
            position: 'side',
        };

        this.mainCard = {
            maxWidth: MAX_WIDTH_MAIN_CARD,
            maxHeight: MAX_HEIGHT_MAIN_CARD,
            position: 'main',
        };
    }

    ngOnInit(): void {}

    onDialogClose(): void {
        this.dialogRef.close();
    }

    moreThanOne(): boolean {
        return this.drawingArray.length > 1;
    }
}
