// tslint:disable:no-relative-imports
import { Observable, of } from 'rxjs';
import { Data } from '../interfaces/data';
import { DrawingData } from '../interfaces/drawing-data';

export class ImgurServiceMock {
    uploadDrawing(): Observable<DrawingData> {
        const mockData = { link: 'log22990.com' } as Data;
        const mockDrawing = { data: mockData, status: 1, success: true } as DrawingData;
        return of(mockDrawing);
    }
}
