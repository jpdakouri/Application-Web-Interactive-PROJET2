import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpService } from './http.service';

// tslint:disable:no-empty
// tslint:disable:no-any
// tslint:disable: no-string-literal
const dialogMock = {
    open: (compent: any, data: any) => {},
};
describe('HttpService', () => {
    let service: HttpService;
    let httpMock: HttpTestingController;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MatDialog, useValue: dialogMock },
            ],
        });
        service = TestBed.inject(HttpService);
        httpMock = TestBed.inject(HttpTestingController);
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

    it('getArraySizeOfDrawing hould send correct request', () => {
        service.getLengthOfDrawings(true).subscribe((result) => {
            expect(result).toEqual(response);
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings/length/true');
        expect(req.request.method).toBe('GET');
        const response = 1;
        req.flush(response);
    });

    it('getOneDrawing should send correct request', () => {
        service.getOneDrawing(1, true).subscribe((result) => {
            expect(result).toEqual(response);
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings/single?index=1&tagFlag=true');
        expect(req.request.method).toBe('GET');
        const response = new DrawingDataMock('1');
        req.flush(response);
    });

    it('#sendTags should send correct request', () => {
        service.sendTags(['none']).subscribe((result) => {
            expect(result).toEqual(response);
        });
        const req = httpMock.expectOne(baseUrl + '/api/drawings/tags');
        expect(req.request.method).toBe('POST');
        const response = 'this is the mongo generated ID';
        req.flush(response);
    });

    it('haddleError can haddle the errors 404 delete', () => {
        service.deleteDrawing('testUrl').subscribe((result) => {
            expect(result).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/api/drawings/testUrl');
        expect(req.request.method).toBe('DELETE');
        req.flush('Aucun dessin trouvé !', { status: 404, statusText: 'Aucun dessin trouvé !' });
    });

    it('haddleError can haddle the errors 404 open', () => {
        service.getOneDrawing(1, true).subscribe((result) => {
            expect(result).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/api/drawings/single?index=1&tagFlag=true');
        expect(req.request.method).toBe('GET');
        req.flush('Aucun dessin trouvé !', { status: 404, statusText: 'Aucun dessin trouvé !' });
    });

    it('haddleError can haddle the errors 404 post', () => {
        service.sendTags(['none']).subscribe((result) => {
            expect(result).toBeUndefined();
        }, fail);
        const req = httpMock.expectOne(baseUrl + '/api/drawings/tags');
        expect(req.request.method).toBe('POST');
        req.flush('Aucun dessin trouvé !', { status: 404, statusText: 'Aucun dessin trouvé !' });
    });

    it('haddleError can haddle the errors 0', () => {
        service.getOneDrawing(1, true).subscribe((result) => {
            expect(result).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/api/drawings/single?index=1&tagFlag=true');
        expect(req.request.method).toBe('GET');
        req.flush('Serveur Indisponible', { status: 0, statusText: '' });
    });

    it('haddleError can haddle the errors 400', () => {
        service.getOneDrawing(1, true).subscribe((result) => {
            expect(result).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/api/drawings/single?index=1&tagFlag=true');
        expect(req.request.method).toBe('GET');
        req.flush('Serveur Indisponible', { status: 400, statusText: "Le document n'a pas pu être inséré dans la base de données !" });
    });

    it('openErrorDialog should open a dialog', () => {
        spyOn(service['dialog'], 'open').and.stub();
        service.openErrorDialog('error');
        expect(dialogMock.open).toHaveBeenCalled();
    });
});
