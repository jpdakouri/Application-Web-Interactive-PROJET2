import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';

export class HttpServiceMock {
    // tslint:disable-next-line:no-empty
    constructor() {}

    // private readonly BASE_URL: string = 'http://localhost:3000';

    // For later !
    // getDrawingsByTags(): Observable<Metadata[]> {
    //     return this.http.get<Metadata[]>(this.BASE_URL + '/api/drawings');
    // }

    deleteDrawing(drawingID: string): Observable<string> {
        return of('something');
    }

    insertDrawing(): Observable<string> {
        return of();
    }

    getOneDrawing(index: number, tag: boolean): Observable<DrawingData> {
        const drawing = new DrawingData('id', 'title', ['tags'], 'url', 100, 100);
        return of(drawing);
    }

    getLengthOfDrawings(): Observable<number> {
        return of(1234);
    }

    sendTags(tags: string[]): Observable<string> {
        return of();
    }

    // getDrawingsByTags(tags: string[]): Observable<DrawingDataMock[]> {}

    // private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {}

    // openErrorDialog(message: string): void {}
}
