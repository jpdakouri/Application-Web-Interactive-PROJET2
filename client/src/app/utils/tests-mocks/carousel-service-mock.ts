import { Observable, of, Subject } from 'rxjs';
// tslint:disable-next-line:no-relative-imports
import { DrawingDataMock } from './drawing-data-mock';

export class CarouselServiceMock {
    drawing1: DrawingDataMock = new DrawingDataMock('1');
    drawing2: DrawingDataMock = new DrawingDataMock('2');
    drawing3: DrawingDataMock = new DrawingDataMock('3');
    drawingArrayMock: DrawingDataMock[] = [];
    initCarousel(): Observable<DrawingDataMock[]> {
        this.drawingArrayMock.push(this.drawing1);
        this.drawingArrayMock.push(this.drawing2);
        this.drawingArrayMock.push(this.drawing3);
        return of(this.drawingArrayMock);
    }

    getArraySizeOfDrawing(): Observable<number> {
        const subject = new Subject<number>();
        return subject.asObservable();
    }

    getDrawing(rightSearch: boolean): Observable<DrawingDataMock> {
        const subject = new Subject<DrawingDataMock>();
        return subject.asObservable();
    }

    openDrawing(drawing: DrawingDataMock): void {}

    async deleteDrawing(id: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this.drawingArrayMock.pop();
            resolve('deleted');
        });
    }
}
