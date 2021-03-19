import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
    @ViewChild('queryFromServer') query: HTMLCanvasElement;
    @ViewChild('matContainer') matContainer: HTMLCanvasElement;
    sideCard: CardStyle;
    mainCard: CardStyle;
    middle: number = 1;
    left: number = 0;
    right: number = 2;
    isLoading: boolean = true;

    drawingArray: DrawingData[] = [];

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
        this.carouselService.initCarousel().subscribe((result) => {
            console.log(result);
            this.drawingArray = result;
            this.isLoading = false;
        });
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Left) this.shiftLeft();
        else if (event.key === KeyboardButtons.Right) this.shiftRight();
    }

    onDialogClose(): void {
        this.drawingArray = [];
        this.isLoading = true;
        this.dialogRef.close();
    }

    deleteDrawing(id: string | undefined): void {
        this.carouselService.deleteDrawing(id as string);
    }

    openDrawing(): void {
        this.carouselService.openDrawing(this.drawingArray[this.middle]);
        this.onDialogClose();
    }

    getAllDrawings(): void {
        this.carouselService.getAllDrawings();
    }

    // updateDrawing(): void {
    //     this.carouselService.updateDrawing();
    // }

    shiftLeft(): void {
        let loadedDrawing: DrawingData;
        this.carouselService.getDrawing(true).subscribe((result) => {
            loadedDrawing = result;
            this.drawingArray = this.drawingArray.slice(this.left, this.middle + 1);

            console.log(loadedDrawing.title);
            console.log(this.drawingArray.indexOf(loadedDrawing));
            if (this.drawingArray.indexOf(loadedDrawing) === -1) this.drawingArray.splice(this.left, 0, loadedDrawing);
        });
    }

    shiftRight(): void {
        let loadedDrawing: DrawingData;
        this.carouselService.getDrawing(false).subscribe((result) => {
            loadedDrawing = result;
            this.drawingArray = this.drawingArray.slice(this.middle, this.right + 1);

            console.log(loadedDrawing.title);
            console.log(this.drawingArray.indexOf(loadedDrawing));
            if (this.drawingArray.indexOf(loadedDrawing) === -1) this.drawingArray.push(loadedDrawing);
        });
    }
    shifteft(): void {
        // requeste ici
        const test = this.drawingArray.slice(2, 3) as DrawingData[];
        this.drawingArray.splice(0, 0, test[0]);
    }

    shifRight(): void {
        // requeste ici
        const test = this.drawingArray.slice(0, 1) as DrawingData[];
        this.drawingArray = this.drawingArray.slice(1, 3);
        this.drawingArray.push(test[0]);
    }
}
