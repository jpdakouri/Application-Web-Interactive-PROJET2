import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { HttpService } from '@app/services/http/http.service';
import { Tag } from '@app/utils/interfaces/tag';
import { HttpServiceMock } from '@app/utils/tests-mocks/http-service-mock';
import { of } from 'rxjs';
import { SaveDrawingService } from './save-drawing.service';

// tslint:disable:no-magic-numbers
describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    let httpServiceMock: HttpServiceMock;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        httpServiceMock = new HttpServiceMock();
        canvasTestHelper = new CanvasTestHelper();
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: HttpService, useValue: httpServiceMock },
                { provide: HTMLCanvasElement, useValue: canvasTestHelper },
            ],
            imports: [
                MatDialogModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
                MatInputModule,
                MatFormFieldModule,
                ReactiveFormsModule,
            ],
        });
        service = TestBed.inject(SaveDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('toStringArray should return an array of tags in string format', () => {
        const tagArray = [{} as Tag, {} as Tag];
        expect(service.toStringArray(tagArray).length).toEqual(2);
    });

    it('addDrawing should send a drawing to the server', () => {
        service.labelsChecked = [{ name: 'tag' } as Tag];
        spyOn(httpServiceMock, 'insertDrawing').and.returnValue(of());
        spyOn(service, 'getDataURLFromCanvas').and.returnValue('url');
        service.fileName = 'name';
        service.originalCanvas = { width: 200, height: 200 } as HTMLCanvasElement;

        service.addDrawing();
        expect(httpServiceMock.insertDrawing).toHaveBeenCalled();
    });

    it('getDataURLFromCanvas should return a string url', () => {
        service.originalCanvas = canvasTestHelper.canvas;
        const context = service.originalCanvas.getContext('2d') as CanvasRenderingContext2D;
        const width = service.originalCanvas.width;
        const height = service.originalCanvas.height;
        let dataURL = '';
        const data = context?.getImageData(0, 0, width, height) as ImageData;
        const compositeOperation = context?.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#ffffff';
        context?.fillRect(0, 0, width, height);
        dataURL = service.originalCanvas.toDataURL('image/png');
        context?.clearRect(0, 0, width, height);
        context?.putImageData(data, 0, 0);
        context.globalCompositeOperation = compositeOperation as string;
        const result = service.getDataURLFromCanvas();
        expect(result).toEqual(dataURL);
    });

    it('getDataURLFromCanvas should return a string url', () => {
        service.originalCanvas = canvasTestHelper.canvas;
        spyOn(service.originalCanvas, 'getContext').and.returnValue(null);
        const result = service.getDataURLFromCanvas();
        expect(result).toEqual('');
    });
});
