import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpService } from './http.service';

fdescribe('HttpService', () => {
    let service: HttpService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(HttpService);
        httpMock = TestBed.inject(HttpTestingController);
        // tslint:disable-next-line: no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(httpMock).toBeTruthy();
    });

    it('#getAllDrawings should send correct request', () => {
        // tslint:disable: no-magic-numbers
        // tslint:disable: deprecation
        service.getAllDrawings().subscribe((result) => {
            expect(result).toEqual(data);
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings');
        expect(req.request.method).toBe('GET');
        const data: DrawingData[] = [];
        for (let i = 0; i < 5; i++) {
            data.push(new DrawingData(undefined, `testTitle${i}`, [`testTag${i}`, `testTag${i + 1}`], new ImageData(100, 100)));
        }
        req.flush(data);
    });
    it('#deleteDrawings should send correct request', () => {
        service.deleteDrawing('testID').subscribe((result) => {
            expect(result).toEqual(response);
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings/testID');
        expect(req.request.method).toBe('DELETE');
        const response = 'Drawing deleted !';
        req.flush(response);
    });
    it('#insertDrawing should send correct request', () => {
        const drawingStub = new DrawingData(undefined, 'testTitle', ['testTag1', 'testTag2'], new ImageData(100, 100));
        service.insertDrawing(drawingStub).subscribe((result) => {
            expect(result).toEqual('this is the mongo generated ID');
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings');
        expect(req.request.method).toBe('POST');
        const response = 'this is the mongo generated ID';
        req.flush(response);
    });

    it('#updateDrawing should send correct request', () => {
        const drawingStub = new DrawingData(undefined, 'testTitle', ['testTag1', 'testTag2'], new ImageData(100, 100));
        service.updateDrawing(drawingStub).subscribe((result) => {
            expect(result).toEqual('Drawing was updated !');
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings/undefined');
        expect(req.request.method).toBe('PUT');
        const response = 'Drawing was updated !';
        req.flush(response);
    });
});
