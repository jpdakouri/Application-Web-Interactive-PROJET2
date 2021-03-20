import { Component, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingCardComponent } from '@app/components/carousel-components/drawing-card/drawing-card.component';
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
    @ViewChildren(DrawingCardComponent) drawingCard: QueryList<DrawingCardComponent>;

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
        this.initCarousel();
    }

    initCarousel(): void {
        this.carouselService.initCarousel().subscribe((result) => {
            this.drawingArray = result;
            if (this.drawingArray.length === 1) {
                this.middle = 0;
            }
            this.isLoading = false;
        });
    }

    onDialogClose(): void {
        this.drawingArray = [];
        this.isLoading = true;
        this.dialogRef.close();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Left) this.shiftLeft();
        else if (event.key === KeyboardButtons.Right) this.shiftRight();
    }

    openDrawing(): void {
        this.carouselService.openDrawing(this.drawingArray[this.middle]);
        this.onDialogClose();
    }

    deleteDrawing(id: string | undefined): void {
        this.isLoading = true;
        this.carouselService.deleteDrawing(id as string).then((res) => {
            this.initCarousel();
        });
    }

    shiftLeft(): void {
        this.carouselService.getDrawing(false).subscribe((result) => {
            this.drawingArray = this.drawingArray.slice(this.left, this.middle + 1);
            this.drawingArray.splice(this.left, 0, result);
            this.drawingCard.map((d) => d.adjustSizeOfImage());
        });
    }

    shiftRight(): void {
        this.carouselService.getDrawing(true).subscribe((result) => {
            this.drawingArray = this.drawingArray.slice(this.middle, this.right + 1);
            this.drawingArray.push(result);

            this.drawingCard.map((d) => d.adjustSizeOfImage());
        });
    }
}
