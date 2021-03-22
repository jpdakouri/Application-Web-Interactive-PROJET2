import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
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
        const canvasDataURL = sessionStorage.getItem('canvasBuffer');
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
        sessionStorage.setItem('canvasBuffer', canvasDataURL);
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
        service.createNewDrawing();
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
        service.createNewDrawing();
        const isCanvasBlank = service.isCanvasBlank();

        expect(isCanvasBlank).toBeFalse();
        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(sessionStorageClearSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when canvas is blank on create new drawing', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        const clearCanvasStub = spyOn(service, 'clearCanvas').and.callThrough();
        service.createNewDrawing();
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
        service.createNewDrawing();

        expect(window.confirm).toHaveBeenCalledWith("Le canvas n'est pas vide! Voulez-vous procéder tout de même?");
        expect(sessionStorageClearSpy).toHaveBeenCalled();
    });
});
