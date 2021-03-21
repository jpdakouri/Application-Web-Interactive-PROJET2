import { Input } from '@angular/core';
// tslint:disable:no-relative-imports
import { CardStyle } from '../interfaces/card-style';
import { DrawingDataMock } from '../tests-mocks/drawing-data-mock';

export class DrawingCardComponentMock {
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingDataMock;
    imageSize: CardStyle;

    constructor() {}

    open(): void {}

    deleteDrawing(): void {}

    // tslint:disable-next-line:no-any
    set drawingData(dd: any) {}

    adjustSizeOfImage(): void {}
}
