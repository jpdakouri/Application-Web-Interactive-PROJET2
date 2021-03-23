import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HttpService } from '@app/services/http/http.service';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { HttpServiceMock } from '@app/utils/tests-mocks/http-service-mock';
import { DrawingData } from '@common/communication/drawing-data';
import { of } from 'rxjs';
import { CarouselService } from './carousel.service';

class DrawingServiceMock {
    // tslint:disable:no-any
    // tslint:disable-next-line:no-empty
    openDrawing(drawing: any): void {}
}

// tslint:disable:no-magic-numbers
describe('CarouselService', () => {
    let service: CarouselService;
    let httpServiceMock: HttpServiceMock;
    let drawingServiceMock: DrawingServiceMock;

    beforeEach(() => {
        httpServiceMock = new HttpServiceMock();
        drawingServiceMock = new DrawingServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: CarouselComponent, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: HttpService, useValue: httpServiceMock },
                { provide: DrawingService, useValue: drawingServiceMock },
            ],
            imports: [MatDialogModule],
        });
        service = TestBed.inject(CarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getArraySizeOfDrawing should return un observable with the new size', () => {
        spyOn(httpServiceMock, 'getLengthOfDrawings').and.returnValue(of(1));
        service.getArraySizeOfDrawing(false);
        expect(service.sizeOfArray).toEqual(1);
    });

    it('initCarousel should call #getArraySizeOfDrawing and return of([]) if size of array < 1', () => {
        const drawing = new DrawingData('id', 'title', ['tags'], 'url', 100, 100);
        service.sizeOfArray = 0;
        spyOn(service, 'getArraySizeOfDrawing').and.returnValue(of(0));
        spyOn(httpServiceMock, 'getLengthOfDrawings').and.returnValue(of(0));
        spyOn(httpServiceMock, 'getOneDrawing').and.returnValue(of(drawing));

        service.initCarousel(false).subscribe((result) => {
            expect(result).toEqual([]);
        });
    });
    it('initCarousel should call #getArraySizeOfDrawing and call getOneDrawing from httpService one time if sizeOfArray = 1 ', () => {
        const drawing = new DrawingData('id', 'title', ['tags'], 'url', 100, 100);
        const array: DrawingData[] = [];
        array.push(drawing);
        spyOn(service, 'getArraySizeOfDrawing').and.returnValue(of(1));
        spyOn(httpServiceMock, 'getLengthOfDrawings').and.returnValue(of(1));
        spyOn(httpServiceMock, 'getOneDrawing').and.returnValue(of(drawing));

        service.initCarousel(false).subscribe((result) => {
            expect(result).toEqual(array);
            expect(httpServiceMock.getOneDrawing).toHaveBeenCalled();
        });
    });

    it('initCarousel should call #getArraySizeOfDrawing and call getOneDrawing from httpService 3 times if sizeOfArray > 1 ', () => {
        const drawing = new DrawingData('id', 'title', ['tags'], 'url', 100, 100);
        const array: DrawingData[] = [];
        array.push(drawing);
        array.push(drawing);
        array.push(drawing);
        spyOn(httpServiceMock, 'getLengthOfDrawings').and.returnValue(of(2));
        spyOn(service, 'getArraySizeOfDrawing').and.returnValue(of(2));
        spyOn(httpServiceMock, 'getOneDrawing').and.callThrough();
        service.sizeOfArray = 2;
        service.initCarousel(false).subscribe((result) => {
            expect(result).toEqual(array);
            expect(httpServiceMock.getOneDrawing).toHaveBeenCalledTimes(3);
        });
    });

    it('getDrawing should be called with the right index depending which side we are shifting', async(() => {
        service.courrentIndex = 0;
        service.sizeOfArray = 5;
        const getDrawingSpy = spyOn(httpServiceMock, 'getOneDrawing').and.returnValue(of(new DrawingDataMock('1')));
        service.getDrawing(false, false);
        expect(getDrawingSpy).toHaveBeenCalledWith(3, false);

        service.courrentIndex = 0;
        service.getDrawing(true, false);
        expect(getDrawingSpy).toHaveBeenCalledWith(2, false);
    }));

    it('openDrawing should call drawing service to open the drawing', () => {
        const openDrawingSpy = spyOn(drawingServiceMock, 'openDrawing').and.stub();
        service.openDrawing({} as DrawingData);
        expect(openDrawingSpy).toHaveBeenCalled();
    });

    it('deleteDrawing should retrun a promise', async(() => {
        spyOn(httpServiceMock, 'deleteDrawing').and.returnValue(of(''));
        service.deleteDrawing('1');
        setTimeout(() => {
            expect(httpServiceMock.deleteDrawing).toHaveBeenCalled();
        }, 200);
    }));
});
