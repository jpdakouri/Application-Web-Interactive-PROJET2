import { Component, Input, OnInit } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrls: ['./drawing-card.component.scss'],
})
export class DrawingCardComponent implements OnInit {
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingData;

    constructor() {}

    ngOnInit(): void {
        //ca bug somehow...
        // this.infoDrawing.tags.forEach((tag) => {
        //     tag = ' ' + tag.valueOf;
        // });
        console.log(this.infoDrawing.title);
    }
}
