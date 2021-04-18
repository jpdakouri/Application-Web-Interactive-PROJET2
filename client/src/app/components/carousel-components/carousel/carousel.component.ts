import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingCardComponent } from '@app/components/carousel-components/drawing-card/drawing-card.component';
import { MAX_HEIGHT_MAIN_CARD, MAX_HEIGHT_SIDE_CARD, MAX_WIDTH_MAIN_CARD, MAX_WIDTH_SIDE_CARD } from '@app/components/components-constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
    @ViewChildren(DrawingCardComponent) drawingCard: QueryList<DrawingCardComponent>;
    private subscribeInit: Subscription = new Subscription();
    private subscribeGet: Subscription = new Subscription();

    sideCard: CardStyle;
    mainCard: CardStyle;
    middle: number = 1;
    left: number = 0;
    right: number = 2;
    isLoading: boolean = true;
    tagFlag: boolean = false;
    drawingArray: DrawingData[] = [];

    constructor(public dialogRef: MatDialogRef<CarouselComponent>, public carouselService: CarouselService, public snackBar: MatSnackBar) {
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
        this.subscribeInit = this.carouselService.initCarousel(this.tagFlag).subscribe((result) => {
            this.drawingArray = result;
            this.middle = this.drawingArray.length === 1 ? 0 : 1;
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.subscribeInit.unsubscribe();
        this.subscribeGet.unsubscribe();
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
        this.carouselService.courrentIndex -= 2;
        this.subscribeGet = this.carouselService.getDrawing(true, this.tagFlag).subscribe((result) => {
            if (result === undefined || result.id !== this.drawingArray[this.middle].id) {
                this.cantOpenDrawing();
                this.initCarousel();
            } else {
                this.carouselService.openDrawing(this.drawingArray[this.middle]);
                this.onDialogClose();
            }
        });
    }

    cantOpenDrawing(): void {
        this.snackBar.open('Le dessin a été supprimé par un autre client. Veuillez en choisir un autre', 'Fermer', {
            duration: 5000,
        });
    }

    deleteDrawing(id: string | undefined): void {
        this.isLoading = true;
        this.carouselService.deleteDrawing(id as string).then((res) => {
            this.initCarousel();
        });
    }

    shiftLeft(): void {
        this.subscribeGet = this.carouselService.getDrawing(false, this.tagFlag).subscribe((result) => {
            this.drawingArray = this.drawingArray.slice(this.left, this.middle + 1);
            this.drawingArray.splice(this.left, 0, result);
            this.drawingCard.map((d) => d.adjustSizeOfImage());
        });
    }

    shiftRight(): void {
        this.subscribeGet = this.carouselService.getDrawing(true, this.tagFlag).subscribe((result) => {
            this.drawingArray = this.drawingArray.slice(this.middle, this.right + 1);
            this.drawingArray.push(result);

            this.drawingCard.map((d) => d.adjustSizeOfImage());
        });
    }

    toggleTagFlag(event: boolean): void {
        this.tagFlag = event;
        this.initCarousel();
    }
}
