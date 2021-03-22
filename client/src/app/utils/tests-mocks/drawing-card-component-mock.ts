import { Input } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';

export class DrawingCardComponentMock {
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingDataMock;
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
