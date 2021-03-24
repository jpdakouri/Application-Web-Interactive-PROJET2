import { Component, Input } from '@angular/core';
// tslint:disable:no-relative-imports
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';

// tslint:disable:no-empty

@Component({
    selector: 'app-drawing-card',
    template: '<p>Mock Product Settings Component</p>',
})
export class MockDrawingCardComponent {
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingDataMock = new DrawingDataMock('id');
    imageSize: CardStyle;

    constructor() {
        return;
    }

    open(): void {
        return;
    }

    deleteDrawing(): void {
        return;
    }

    set drawingData(dd: DrawingDataMock) {
        return;
    }

    adjustSizeOfImage(): void {
        return;
    }
}
