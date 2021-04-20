import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Data } from '@app/utils/interfaces/data';
import { DrawingData } from '@app/utils/interfaces/drawing-data';
import { ImgurApiService } from './imgur-api.service';

describe('ImgurApiService', () => {
    let service: ImgurApiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(ImgurApiService);
    });

    afterAll(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#uploadDrawing should upload drawing on imgur server', () => {
        const fileName = 'drawing_1';
        const imageSource = 'xhOCykIZgDDaSEFwQ';
        const mockData = { name: fileName, link: 'log2990306.com' } as Data;
        const mockDrawing = { data: mockData, status: 1, success: true } as DrawingData;

        service.uploadDrawing(fileName, imageSource).subscribe((drawingData) => {
            expect(drawingData.data.name).toEqual('drawing_1');
            expect(drawingData.data.link).toEqual('log2990306.com');
            expect(drawingData.status).toEqual(1);
            expect(drawingData.success).toEqual(true);
        });

        const request = httpTestingController.expectOne('https://api.imgur.com/3/image');
        expect(request.request.method).toEqual('POST');

        request.flush(mockDrawing);
    });
});
