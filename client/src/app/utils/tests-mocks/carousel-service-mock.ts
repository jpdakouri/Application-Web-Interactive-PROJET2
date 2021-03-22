import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { Observable, of } from 'rxjs';

export class CarouselServiceMock {
    drawingArrayMock: DrawingDataMock[] = [];

    initMock(howMany: number): void {
        for (let i = 0; i < howMany; i++) this.drawingArrayMock.push(new DrawingDataMock(i.toString()));
    }
    initCarousel(): Observable<DrawingDataMock[]> {
        return of(this.drawingArrayMock);
    }

    getDrawing(rightSearch: boolean): Observable<DrawingDataMock> {
        return of();
    }

    openDrawing(drawing: DrawingDataMock): void {
        return;
    }

    async deleteDrawing(id: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this.drawingArrayMock.pop();
            resolve('deleted');
        });
    }
}
