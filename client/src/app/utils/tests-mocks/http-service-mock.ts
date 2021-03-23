import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
const WIDTH = 100;
const HEIGHT = 100;
export class HttpServiceMock {
    // tslint:disable-next-line:no-empty
    constructor() {}

    deleteDrawing(drawingID: string): Observable<string> {
        return of('something');
    }

    insertDrawing(): Observable<string> {
        return of();
    }

    getOneDrawing(index: number, tag: boolean): Observable<DrawingData> {
        const drawing = new DrawingData('id', 'title', ['tags'], 'url', WIDTH, HEIGHT);
        return of(drawing);
    }

    getLengthOfDrawings(): Observable<number> {
        return of();
    }

    sendTags(tags: string[]): Observable<string> {
        return of();
    }
}
