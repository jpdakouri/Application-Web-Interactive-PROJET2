import { Component, Input } from '@angular/core';
// tslint:disable:no-relative-imports
import { CardStyle } from '../interfaces/card-style';
import { DrawingDataMock } from '../tests-mocks/drawing-data-mock';

// tslint:disable:no-empty

@Component({
    selector: 'app-drawing-card',
    template: '<p>Mock Product Settings Component</p>',
})
export class MockDrawingCardComponent {
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingDataMock = new DrawingDataMock('id');
    imageSize: CardStyle;

    constructor() {}

    open(): void {}

    deleteDrawing(): void {}

    // tslint:disable-next-line:no-any
    set drawingData(dd: any) {}

    adjustSizeOfImage(): void {}
}
