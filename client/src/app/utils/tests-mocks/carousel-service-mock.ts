// tslint:disable:no-relative-imports
import { Observable, of, Subject } from 'rxjs';
import { DrawingDataMock } from './drawing-data-mock';

export class CarouselServiceMock {
    drawingArrayMock: DrawingDataMock[] = [];

    initMock(howMany: number): void {
        for (let i = 0; i < howMany; i++) this.drawingArrayMock.push(new DrawingDataMock(i.toString()));
    }
    initCarousel(): Observable<DrawingDataMock[]> {
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
