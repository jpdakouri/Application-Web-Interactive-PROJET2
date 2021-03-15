import { Component, OnInit } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';
const MAX_WIDTH_SIDE_CARD = '15vw';
const MAX_HEIGHT_SIDE_CARD = '20vh';
const MAX_WIDTH_MAIN_CARD = '23vw';
const MAX_HEIGHT_MAIN_CARD = '30vh';
@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    sideCard: CardStyle;
    mainCard: CardStyle;
    // tslint:disable:no-empty
    constructor() {
        this.sideCard = {
            maxWidth: MAX_WIDTH_SIDE_CARD,
            maxHeight: MAX_HEIGHT_SIDE_CARD,
        };

        this.mainCard = {
            maxWidth: MAX_WIDTH_MAIN_CARD,
            maxHeight: MAX_HEIGHT_MAIN_CARD,
        };
    }

    ngOnInit(): void {}

    createArray(): number[] {
        // tslint:disable-next-line:no-magic-numbers
        return new Array(3);
    }
}
