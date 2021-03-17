import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrls: ['./drawing-card.component.scss'],
})
export class DrawingCardComponent implements AfterViewInit {
    @ViewChild('image') image: HTMLCanvasElement;
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingData;
    imageSize: CardStyle;

    constructor() {}

    ngAfterViewInit(): void {
        console.log('oui');
        const attribute = this.infoDrawing.width > this.infoDrawing.height ? '"width: 90%, height: auto"' : 'width: 75% , height: auto';
        this.image.setAttribute('style', attribute);
    }
}
