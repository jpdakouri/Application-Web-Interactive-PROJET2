import { Observable, of } from 'rxjs';
import { DrawingDataMock } from './drawing-data-mock';

export class HttpServiceMock {
    // tslint:disable-next-line:no-empty
    constructor() {}

    deleteDrawing(drawingID: string): Observable<string> {
        return of();
    }

    insertDrawing(): Observable<string> {
        return of();
    }

    getOneDrawing(index: number, tag: boolean): Observable<DrawingDataMock> {
        return of();
    }

    getLengthOfDrawings(): Observable<number> {
        return of();
    }

    sendTags(tags: string[]): Observable<string> {
        return of();
    }
}
