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

    // it('should restoreCanvas on page load', () => {
    //     spyOn(service, 'saveCanvas');
    //     spyOn(service, 'restoreCanvas');
    //     const rectangleWidth = 150;
    //     const rectangleHeight = 75;
    //     service.baseCtx.fillRect(0, 0, rectangleWidth, rectangleHeight);
    //     service.saveCanvas(canvasTestHelper.canvas.width, canvasTestHelper.canvas.height);
    //     // service.clearCanvas(service.baseCtx);
    //
    //     service.restoreCanvas();
    //     expect(service.isCanvasBlank()).toBeFalse();
    // });

    // it('should calculate the working zone size', () => {
    //     // @ts-ignore
    //     const windowSize = {
    //         innerHeight: 500,
    //         innerWidth: 500,
    //     } as Window;
    //
    //     expect(service.calculateWorkingZoneSize()).toBe({ x: 200, y: 200 });
    // });
});
