import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown emits a new primary color for a left click, and a new secondary color for a right click', () => {
        const stubRgbValue = 100;
        const stubRgbArray = new Uint8ClampedArray([stubRgbValue, stubRgbValue, stubRgbValue, stubRgbValue]);
        const stubImageData = new ImageData(stubRgbArray, 1);
        spyOn(baseCanvasContext, 'getImageData').and.returnValue(stubImageData);

        const currentColorService = TestBed.inject(CurrentColourService);
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

        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        const leftClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 });
        service.onMouseDown(leftClickEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });
});
