import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService, shapeStyle } from './rectangle.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum KeyboardKeys {
    Escape = 'Escape',
    Shift = 'Shift',
    One = '1',
}

describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
    let drawSquareSpy: jasmine.Spy<any>;
    let drawOutlineSpy: jasmine.Spy<any>;
    let drawFilledSpy: jasmine.Spy<any>;
    let drawFilledOutlineSpy: jasmine.Spy<any>;

    // let updatePreviewSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        drawOutlineSpy = spyOn<any>(service, 'drawOutline').and.callThrough();
        drawFilledSpy = spyOn<any>(service, 'drawFilled').and.callThrough();
        drawFilledOutlineSpy = spyOn<any>(service, 'drawFilledOutline').and.callThrough();
        // updatePreviewSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set value to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' keys should perform their task', () => {
        // service.mouseDownCoord = { x: 20, y: 20 };

        service.onKeyDown({
            key: KeyboardKeys.Escape,
        } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();

        service.onKeyDown({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it('onKeyup should update shift state', () => {
        service['shiftDown'] = true;
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };

        service.onKeyUp({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeFalse();
    });

    it('drawSquare should be called when shiftDown is true', () => {
        service.mouseDown = true;
        service['shiftDown'] = true;

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it('drawSquare should not be called when shiftDown is false ', () => {
        service.mouseDown = true;
        service['shiftDown'] = false;

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawSquareSpy).not.toHaveBeenCalled();
    });

    it(' drawOutline should be called when shapeStyle Outline is selected', () => {
        service.mouseDownCoord = { x: 25, y: 25 };

        service['firstGrid'] = { x: 0, y: 0 };
        service.mouseDown = true;
        service['shapeStyle'] = shapeStyle.Outline;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawOutlineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), service.mouseDownCoord);
    });

    it(' drawFilled should be called when shapeeStyke Filled is selected', () => {
        service.mouseDownCoord = { x: 25, y: 25 };

        service['firstGrid'] = { x: 0, y: 0 };
        service.mouseDown = true;
        service['shapeStyle'] = shapeStyle.Filled;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), service.mouseDownCoord);
    });

    it(' drawFilledOutline should be called when shapeeStyke  is selected', () => {
        service.mouseDownCoord = { x: 25, y: 25 };

        service.mouseDown = true;
        service['shapeStyle'] = shapeStyle.FilledOutline;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledOutlineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), service.mouseDownCoord);
    });

    it(' isXgreater than Y', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 10, y: 0 };
        expect(service['isXGreaterThanY']).toBe(true);
    });
});
