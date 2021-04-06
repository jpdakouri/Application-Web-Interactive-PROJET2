import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingData } from '@common/communication/drawing-data';
import { DrawingService } from './drawing.service';

fdescribe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should return true when canvas is blank', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasBlank()).toBeTrue();
    });

    it('should return false when canvas is not blank', () => {
        const rectangleWidth = 1;
        const rectangleHeight = 1;
        service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
        expect(service.isCanvasBlank()).toBeFalse();
    });

    it('#saveCanvas should save the canvas to session storage', () => {
        const RECTANGLE_OFFSET = 20;
        const RECTANGLE_DIMENSIONS = 20;
        service.baseCtx.beginPath();
        service.baseCtx.rect(RECTANGLE_OFFSET, RECTANGLE_OFFSET, RECTANGLE_DIMENSIONS, RECTANGLE_DIMENSIONS);
        service.baseCtx.stroke();
        service.saveCanvas();
        const expectedCanvasDataURL = service.canvas.toDataURL();
        const canvasDataURL = sessionStorage.getItem('canvasInfo');
        expect(canvasDataURL).toEqual(expectedCanvasDataURL);
        service.baseCtx.beginPath();
        service.baseCtx.rect(RECTANGLE_OFFSET + 1, RECTANGLE_OFFSET + 1, RECTANGLE_DIMENSIONS + 1, RECTANGLE_DIMENSIONS + 1);
        service.baseCtx.stroke();
        const differentCanvasURL = service.canvas.toDataURL();
        expect(canvasDataURL).not.toEqual(differentCanvasURL);
    });

    it('#restoreCanvas should restore canvas from session storage', async (done) => {
        // tslint:disable:no-magic-numbers
        service.canvas.width = 10;
        service.canvas.height = 10;
        const RECTANGLE_OFFSET = 2;
        const RECTANGLE_DIMENSIONS = 2;
        service.baseCtx.beginPath();
        service.baseCtx.rect(RECTANGLE_OFFSET, RECTANGLE_OFFSET, RECTANGLE_DIMENSIONS, RECTANGLE_DIMENSIONS);
        service.baseCtx.stroke();
        const canvasDataURL = service.canvas.toDataURL();
        sessionStorage.setItem('canvasInfo', canvasDataURL);
        const canvasImageData = service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height);
        const originalPixels = canvasImageData.data;

        service.baseCtx.clearRect(0, 0, service.canvas.width, service.canvas.height);
        service.baseCtx.beginPath();
        service.baseCtx.rect(RECTANGLE_OFFSET + 1, RECTANGLE_OFFSET + 1, RECTANGLE_DIMENSIONS + 1, RECTANGLE_DIMENSIONS + 1);
        service.baseCtx.stroke();
        const differentCanvasImageData = service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height);
        const differentPixels = differentCanvasImageData.data;

        service.baseCtx.clearRect(0, 0, service.canvas.width, service.canvas.height);

        service.restoreCanvas();
        setTimeout(() => {
            const restoredImageData = service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height);
            const restoredPixels = restoredImageData.data;
            const hasSamePixels1 = restoredPixels.some((pixel, index) => pixel !== originalPixels[index]);
            const hasSamePixels2 = restoredPixels.some((pixel, index) => pixel !== differentPixels[index]);
            expect(hasSamePixels1).toEqual(false);
            expect(hasSamePixels2).toEqual(true);
            done();
        }, 500);
    });

    it('should not create new drawing when canvas is not blank', () => {
        const clearCanvasStub = spyOn(service, 'clearCanvas').and.callThrough();
        const rectangleWidth = 1;
        const rectangleHeight = 1;
        service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
        service.saveCanvas();
        spyOn(window, 'confirm').and.returnValue(false);
        service.createNewDrawing(true);
        const isCanvasBlank = service.isCanvasBlank();

        expect(isCanvasBlank).toBeFalse();
        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(clearCanvasStub).not.toHaveBeenCalled();
    });

    it('should not clear the session storage on create new drawing when canvas is not blank', () => {
        const sessionStorageClearSpy = spyOn(window.sessionStorage, 'clear').and.callThrough();
        const rectangleWidth = 10;
        const rectangleHeight = 10;
        service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
        service.saveCanvas();
        spyOn(window, 'confirm').and.returnValue(false);
        service.createNewDrawing(true);
        const isCanvasBlank = service.isCanvasBlank();

        expect(isCanvasBlank).toBeFalse();
        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(sessionStorageClearSpy).not.toHaveBeenCalled();
    });

    it('isCanvasBlank should true if baseCanva is undefined', () => {
        service.baseCtx = (null as unknown) as CanvasRenderingContext2D;
        const returnValue = service.isCanvasBlank();
        expect(returnValue).toBe(true);
    });

    it('restoreCanvas shouldnt drawImage if there is no image', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(null);
        spyOn(service.baseCtx, 'drawImage').and.stub();
        service.restoreCanvas();
        expect(service.baseCtx.drawImage).not.toHaveBeenCalled();
    });

    it('should do nothing when canvas is blank on create new drawing', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        const clearCanvasStub = spyOn(service, 'clearCanvas').and.callThrough();
        service.createNewDrawing(true);
        expect(clearCanvasStub).not.toHaveBeenCalled();
        expect(service.isCanvasBlank()).toBeTrue();
    });

    it('should clear the session storage on create new drawing when canvas is not blank', () => {
        const sessionStorageClearSpy = spyOn(window.sessionStorage, 'clear').and.callThrough();
        const rectangleWidth = 10;
        const rectangleHeight = 10;
        service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
        service.saveCanvas();
        spyOn(window, 'confirm').and.returnValue(true);
        service.createNewDrawing(true);

        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(sessionStorageClearSpy).toHaveBeenCalled();
    });

    it('#createNewDrawing should call #emitCreateNewDrawing if canvas is not blank', () => {
        const emitSpy = spyOn(service, 'emitCreateNewDrawing').and.callThrough();
        const rectangleWidth = 10;
        const rectangleHeight = 10;

        service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
        service.saveCanvas();

        spyOn(window, 'confirm').and.returnValue(true);

        service.createNewDrawing(true);

        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(emitSpy).toHaveBeenCalled();
    });

    it('openDrawing should call saveCanvas', () => {
        spyOn(service, 'createNewDrawing').and.stub();
        spyOn(service, 'saveCanvas').and.stub();
        const newDrawing = {
            width: 100,
            height: 100,
        } as DrawingData;
        service.openDrawing(newDrawing, true);
        expect(service.saveCanvas).toHaveBeenCalled();
    });

    it('openDrawing should draw an image', () => {
        spyOn(service, 'createNewDrawing').and.stub();
        spyOn(service, 'saveCanvas').and.stub();
        const canva = canvasTestHelper.canvas.toDataURL('image/png');
        const newDrawing = {
            width: 100,
            height: 100,
            dataURL: canva,
        } as DrawingData;
        service.openDrawing(newDrawing, true);
        expect(service.saveCanvas).toHaveBeenCalled();
    });
});
