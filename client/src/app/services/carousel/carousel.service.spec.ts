import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { HttpService } from '@app/services/http/http.service';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { HttpServiceMock } from '@app/utils/tests-mocks/http-service-mock';
import { of } from 'rxjs';
import { CarouselService } from './carousel.service';

fdescribe('CarouselService', () => {
    let service: CarouselService;
    let httpServiceMock: HttpServiceMock;

    beforeEach(() => {
        httpServiceMock = new HttpServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: CarouselComponent, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: HttpService, useValue: httpServiceMock },
            ],
            imports: [MatDialogModule],
        });
        service = TestBed.inject(CarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getArraySizeOfDrawing should return un observable with the new size', async(() => {
        spyOn(httpServiceMock, 'getLengthOfDrawings').and.returnValue(of(1));
        service.getArraySizeOfDrawing().subscribe((result) => {
            expect(result).toEqual(1);
        });
    }));

    it('getDrawing should be called with the right index depending which side we are shifting', async(() => {
        service.courrentIndex = 0;
        service.sizeOfArray = 5;
        const getDrawingSpy = spyOn(httpServiceMock, 'getOneDrawing').and.returnValue(of(new DrawingDataMock('1')));
        service.getDrawing(false);
        expect(getDrawingSpy).toHaveBeenCalledWith(3);

        service.courrentIndex = 0;
        service.getDrawing(true);
        expect(getDrawingSpy).toHaveBeenCalledWith(2);
    }));
});
