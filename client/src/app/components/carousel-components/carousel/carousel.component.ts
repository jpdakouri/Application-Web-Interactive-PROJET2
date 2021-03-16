import { Component, HostListener } from '@angular/core';
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
export class CarouselComponent {
    sideCard: CardStyle;
    mainCard: CardStyle;
    middle: number = 1;
    left: number = 0;
    right: number = 2;

    drawingArray: DrawingData[];

    constructor(public dialogRef: MatDialogRef<CarouselComponent>, public carouselService: CarouselService) {
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
        this.drawingArray = this.carouselService.initCarousel();
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

    shiftLeft(): void {
        // requeste ici
        // const test = this.drawingArray.slice(0, 1) as DrawingData[];
        this.drawingArray.slice(this.left, this.left + 1);
        const loadedDrawing = this.carouselService.getDrawing(false);
        this.drawingArray = this.drawingArray.slice(this.middle, this.right + 1);
        if (this.drawingArray.indexOf(loadedDrawing) >= 0) this.drawingArray.push(loadedDrawing);
    }

    shiftRight(): void {
        // requeste ici
        // const test = this.drawingArray.slice(2, 3) as DrawingData[];
        this.drawingArray.slice(this.right, this.right + 1);
        const loadedDrawing = this.carouselService.getDrawing(true);
        if (this.drawingArray.indexOf(loadedDrawing) >= 0) this.drawingArray.splice(this.left, 0, loadedDrawing);
    }
}
