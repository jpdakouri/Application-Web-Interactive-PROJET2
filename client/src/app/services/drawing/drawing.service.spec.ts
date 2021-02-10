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

    it('#restoreCanvas should restore canvas from session storage', () => {
        const RECTANGLE_OFFSET = 20;
        const RECTANGLE_DIMENSIONS = 20;
        service.baseCtx.beginPath();
        service.baseCtx.rect(RECTANGLE_OFFSET, RECTANGLE_OFFSET, RECTANGLE_DIMENSIONS, RECTANGLE_DIMENSIONS);
        service.baseCtx.stroke();
        const expectedCanvasDataURL = service.canvas.toDataURL();
        sessionStorage.setItem('canvasBuffer', expectedCanvasDataURL);
        service.restoreCanvas();
        const expectedCanvasDataURL2 = service.canvas.toDataURL();
        expect(expectedCanvasDataURL).toEqual(expectedCanvasDataURL2);

        // sessionStorage.setItem('canvasBuffer', expectedCanvasDataURL);
        // service.baseCtx.clearRect(0, 0, service.canvas.width, service.canvas.height);
        // const differentCanvasDataURL = service.canvas.toDataURL();
        // expect(expectedCanvasDataURL).not.toEqual(differentCanvasDataURL);
        // const dataURL = sessionStorage.getItem('canvasBuffer');
        // const image = new Image();
        // if (dataURL) {
        //     image.src = dataURL;
        //     image.onload = () => {
        //         service.baseCtx.drawImage(image, 0, 0);
        //         service.previewCtx.drawImage(image, 0, 0);
        //     };
        // }
        // const canvasDataURL = service.canvas.toDataURL();
        // expect(expectedCanvasDataURL).toEqual(canvasDataURL);
        // expect(canvasDataURL).not.toEqual(differentCanvasDataURL);
    });
});
