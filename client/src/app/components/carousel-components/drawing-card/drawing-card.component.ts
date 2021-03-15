import { Component, Input, OnInit } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrls: ['./drawing-card.component.scss'],
})
export class DrawingCardComponent implements OnInit {
    @Input() imageToShow: string;
    @Input() positionOfDrawing: CardStyle;
    constructor() {}

    ngOnInit(): void {}
}
