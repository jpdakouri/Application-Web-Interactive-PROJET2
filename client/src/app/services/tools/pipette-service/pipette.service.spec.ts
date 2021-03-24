import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_CANVAS_RGBA } from '@app/services/services-constants';
import { OUT_OF_BOUND_COLOR_RGBA } from '@app/services/tools/tools-constants';

import { PipetteService } from './pipette.service';

describe('PipetteService', () => {
    let service: PipetteService;
    let baseCanvasContext: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawingService: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PipetteService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingService = TestBed.inject(DrawingService);

        baseCanvasContext = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.baseCtx = baseCanvasContext;
        drawingService.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown emits a new primary color for a left click, and a new secondary color for a right click', () => {
        const stubRgbValue = 100;
        const stubRgbArray = new Uint8ClampedArray([stubRgbValue, stubRgbValue, stubRgbValue, stubRgbValue]);
        const stubImageData = new ImageData(stubRgbArray, 1);
        spyOn(baseCanvasContext, 'getImageData').and.returnValue(stubImageData);

        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        spyOn(currentColorService, 'setSecondaryColorRgb');
        const leftClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 });
        service.onMouseDown(leftClickEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('100,100,100');
        const rightClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 });
        service.onMouseDown(rightClickEvent);
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledWith('100,100,100');
    });

    it('onMouseDown emits the canvas default background color if nothing was drawn at the selected pixel', () => {
        const stubRgbValue = 0;
        const stubRgbArray = new Uint8ClampedArray([stubRgbValue, stubRgbValue, stubRgbValue, stubRgbValue]);
        const stubImageData = new ImageData(stubRgbArray, 1);
        spyOn(baseCanvasContext, 'getImageData').and.returnValue(stubImageData);

        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        const leftClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 });
        service.onMouseDown(leftClickEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });

    it('onMouseEnter sets isCursorOnCanvas to true, onMouseLeave sets it to false', () => {
        service.onMouseEnter();
        expect(service.getIsCursorOnCanvas()).toBeTrue();
        service.onMouseLeave();
        expect(service.getIsCursorOnCanvas()).toBeFalse();
    });

    it('onMouseMove returns OUT_OF_BOUND_COLOR_RGBA if pixel is not on canvas or not in the preview center, returns DEFAULT_CANVAS_RGBA if pixel on blank canvas', () => {
        const mouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
        service.onMouseEnter();
        service.onMouseMove(mouseEvent);
        expect(service.getPreviewColors()[0][0]).toBe(OUT_OF_BOUND_COLOR_RGBA);
        const middleOfArrayIndex = 7;
        expect(service.getPreviewColors()[middleOfArrayIndex][middleOfArrayIndex]).toBe(DEFAULT_CANVAS_RGBA);
        const endOfArrayIndex = 14;
        expect(service.getPreviewColors()[endOfArrayIndex][endOfArrayIndex]).toBe(OUT_OF_BOUND_COLOR_RGBA);
    });
    it('onMouseMove returns color of pixel if the pixel is not blank', () => {
        const stubRgbValue = 1;
        const stubRgbArray = new Uint8ClampedArray([stubRgbValue, stubRgbValue, stubRgbValue, stubRgbValue]);
        const stubImageData = new ImageData(stubRgbArray, 1);
        spyOn(baseCanvasContext, 'getImageData').and.returnValue(stubImageData);

        const mouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
        service.onMouseEnter();
        service.onMouseMove(mouseEvent);

        const middleOfArrayIndex = 7;
        expect(service.getPreviewColors()[middleOfArrayIndex][middleOfArrayIndex]).toBe('rgba(1,1,1,1)');
    });

    it('onMouseMove does not generate a preview if the cursor is not on the canvas', () => {
        const stubRgbValue = 1;
        const stubRgbArray = new Uint8ClampedArray([stubRgbValue, stubRgbValue, stubRgbValue, stubRgbValue]);
        const stubImageData = new ImageData(stubRgbArray, 1);
        spyOn(baseCanvasContext, 'getImageData').and.returnValue(stubImageData);

        const mouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
        service.onMouseLeave();
        service.onMouseMove(mouseEvent);

        expect(service.getPreviewColors()).toBeUndefined();
    });

    it('executeCommand does nothing and returns nothing', () => {
        expect(service.executeCommand()).toBeUndefined();
    });
});
