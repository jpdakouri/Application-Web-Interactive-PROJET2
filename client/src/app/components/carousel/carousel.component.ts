import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    // tslint:disable:no-empty
    constructor() {}

    ngOnInit(): void {}

    createArray(): number[] {
        // tslint:disable-next-line:no-magic-numbers
        return new Array(10);
    }
}
