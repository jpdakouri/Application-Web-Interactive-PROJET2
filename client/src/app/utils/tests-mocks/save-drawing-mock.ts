import { ElementRef } from '@angular/core';
import { Tag } from '@app/utils/interfaces/tag';
import { DrawingDataMock } from './drawing-data-mock';

export class SaveDrawingServiceMock {
    originalCanvas: HTMLCanvasElement;
    id: number;
    image: ElementRef<HTMLImageElement>;
    fileName: string;

    drawing: DrawingDataMock;
    labelsChecked: Tag[];

    // tslint:disable:no-empty
    constructor() {}

    addDrawing(): void {}
}
