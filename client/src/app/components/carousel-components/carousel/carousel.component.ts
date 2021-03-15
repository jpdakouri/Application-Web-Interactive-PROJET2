import { Component, OnInit } from '@angular/core';
import { MAX_HEIGHT_MAIN_CARD, MAX_HEIGHT_SIDE_CARD, MAX_WIDTH_MAIN_CARD, MAX_WIDTH_SIDE_CARD } from '@app/components/components-constants';
import { CardStyle } from '@app/utils/interfaces/card-style';
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
            position: 'side',
        };

        this.mainCard = {
            maxWidth: MAX_WIDTH_MAIN_CARD,
            maxHeight: MAX_HEIGHT_MAIN_CARD,
            position: 'main',
        };
    }

    ngOnInit(): void {}
}
