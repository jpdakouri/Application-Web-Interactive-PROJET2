import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpService } from './http.service';

describe('HttpService', () => {
    let service: HttpService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatDialogModule],
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
        // tslint:disable-next-line:no-magic-numbers
        const drawingStub = new DrawingData(undefined, 'testTitle', ['testTag1', 'testTag2'], 'dataURL', 100, 100);
        service.insertDrawing(drawingStub).subscribe((result) => {
            expect(result).toEqual('this is the mongo generated ID');
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings');
        expect(req.request.method).toBe('POST');
        const response = 'this is the mongo generated ID';
        req.flush(response);
    });
});
