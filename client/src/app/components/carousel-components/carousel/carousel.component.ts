import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAX_HEIGHT_MAIN_CARD, MAX_HEIGHT_SIDE_CARD, MAX_WIDTH_MAIN_CARD, MAX_WIDTH_SIDE_CARD } from '@app/components/components-constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
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
    middle: number = 1;
    left: number = 0;
    right: number = 2;

    drawingArray: DrawingData[];

    constructor(public dialogRef: MatDialogRef<CarouselComponent>, public carouselService: CarouselService) {
        this.sideCard = {
            width: MAX_WIDTH_SIDE_CARD,
            height: MAX_HEIGHT_SIDE_CARD,
            position: 'side',
        };

        this.mainCard = {
            width: MAX_WIDTH_MAIN_CARD,
            height: MAX_HEIGHT_MAIN_CARD,
            position: 'main',
        };
    }

    ngOnInit(): void {
        this.carouselService.initCarousel();
        this.drawingArray = this.carouselService.drawingsToShow;
        console.log(this.carouselService.sizeOfArray);
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Left) this.shiftLeft();
        else if (event.key === KeyboardButtons.Right) this.shiftRight();
    }

    onDialogClose(): void {
        this.drawingArray = [];
        this.dialogRef.close();
    }

    // updateDrawing(): void {
    //     this.carouselService.updateDrawing();
    // }

    deleteDrawing(): void {
        this.carouselService.deleteDrawing();
    }

    getAllDrawings(): void {
        this.carouselService.getAllDrawings();
    }

    // shiftLeft(): void {
    //     const loadedDrawing = this.carouselService.getDrawing(true);
    //     this.drawingArray = this.drawingArray.slice(this.left, this.middle + 1);

    //     console.log(this.drawingArray);
    //     console.log(loadedDrawing);

    //     if (this.drawingArray.indexOf(loadedDrawing) >= 0) this.drawingArray.splice(this.left, 0, loadedDrawing);
    // }

    // shiftRight(): void {
    //     const loadedDrawing = this.carouselService.getDrawing(false);
    //     this.drawingArray = this.drawingArray.slice(this.middle, this.right + 1);

    //     console.log(this.drawingArray);
    //     console.log(loadedDrawing);

    //     if (this.drawingArray.indexOf(loadedDrawing) >= 0) this.drawingArray.push(loadedDrawing);
    // }
    shiftLeft(): void {
        // requeste ici
        const test = this.drawingArray.slice(2, 3) as DrawingData[];
        this.drawingArray.splice(0, 0, test[0]);
    }

    shiftRight(): void {
        // requeste ici
        const test = this.drawingArray.slice(0, 1) as DrawingData[];
        this.drawingArray = this.drawingArray.slice(1, 3);
        this.drawingArray.push(test[0]);
    }
}
