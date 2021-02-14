import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { EllipseService } from './ellipse.service';

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

describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-any
    let drawEllipseSpy: jasmine.Spy<any>;
    let drawCircleSpy: jasmine.Spy<any>;
    let drawOutlineSpy: jasmine.Spy<any>;
    let drawFilledSpy: jasmine.Spy<any>;
    let drawFilledOutlineSpy: jasmine.Spy<any>;
    let drawPerimeterSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.callThrough();
        drawOutlineSpy = spyOn<any>(service, 'drawOutline').and.callThrough();
        drawFilledSpy = spyOn<any>(service, 'drawFilled').and.callThrough();
        drawFilledOutlineSpy = spyOn<any>(service, 'drawFilledOutline').and.callThrough();
        drawPerimeterSpy = spyOn<any>(service, 'drawPerimeter').and.callThrough();
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
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

    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 10, y: 10 };
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' keys should perform their task', () => {
        service.onKeyDown({
            key: KeyboardKeys.Escape,
        } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();

        service.onKeyDown({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('onKeyup should update shift state', () => {
        service['shiftDown'] = true;
        service['firstGrid'] = { x: 10, y: 10 };
        const updatePreviewSpy = spyOn<any>(service, 'updatePreview').and.stub();
        service.mouseDownCoord = { x: 50, y: 50 };
        service.onKeyUp({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(updatePreviewSpy).toHaveBeenCalled();
        expect(service['shiftDown']).toBeFalse();
    });

    it('onKeyup should not update shift state if shiftDown is false', () => {
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };

        service.onKeyDown({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('onKeyup should not update shift state if shiftDown is false', () => {
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };

        service.onKeyDown({
            key: KeyboardKeys.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('drawCircle should be called when shiftDown is true', () => {
        service.mouseDown = true;
        service['shiftDown'] = true;

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('on MouseUp drawCircle should be called when shiftDown is true', () => {
        service.mouseDown = true;
        service['shiftDown'] = true;
        // const contextSpyObj = jasmine.createSpyObj('MouseEvent', []);
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('drawCircle should not be called when shiftDown is false ', () => {
        service.mouseDown = true;
        service['shiftDown'] = false;

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawCircleSpy).not.toHaveBeenCalled();
    });

    it(' drawOutline should be called when shapeStyle Outline is selected', () => {
        service['shapeStyle'] = ShapeStyle.Outline;
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['beginPath', 'ellipse', 'stroke']);
        // const ctxStub = {} as CanvasRenderingContext2D;
        const finalGrid: Vec2 = { x: 100, y: 100 };
        drawOutlineSpy.and.stub();
        service['drawEllipse'](contextSpyObj, finalGrid);
        expect(drawOutlineSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawFilled should be called when shapeStyke Filled is selected', () => {
        service['firstGrid'] = { x: 0, y: 0 };
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.Filled;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), service.mouseDownCoord);
    });

    it(' drawFilledOutline should be called when shapeStyke is selected', () => {
        service['shapeStyle'] = ShapeStyle.FilledOutline;
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['beginPath', 'ellipse', 'fill', 'stroke']);
        const finalGrid: Vec2 = { x: 100, y: 100 };
        drawOutlineSpy.and.stub();
        service['drawEllipse'](contextSpyObj, finalGrid);
        expect(drawFilledOutlineSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' every quadrant of drawCircle should be called', () => {
        service.mouseDownCoord = { x: 300, y: 200 };
        service['firstGrid'] = { x: 0, y: 0 };
        service['shiftDown'] = true;
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service.drawCircle(val);
        expect(val).toEqual(expected);

        service.mouseDownCoord = { x: -300, y: 200 };
        const val2 = service.mouseDownCoord;
        service.drawCircle(val2);
        const expected2 = { x: 200, y: 200 } as Vec2;
        expect(val).toEqual(expected2);

        service.mouseDownCoord = { x: 200, y: -300 };
        const val3 = service.mouseDownCoord;
        service.drawCircle(val3);
        const expected3 = { x: 200, y: 200 } as Vec2;
        expect(val).toEqual(expected3);

        service.mouseDownCoord = { x: -300, y: -200 };
        const val4 = service.mouseDownCoord;
        service.drawCircle(val4);
        const expected4 = { x: 200, y: 200 } as Vec2;
        expect(val).toEqual(expected4);
    });

    it(' drawPerimeter works even when there is a negative coordinate in x', () => {
        // service['shapeStyle'] = shapeStyle.Outline;
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle']);
        const finalGrid: Vec2 = { x: -100, y: 100 };
        drawPerimeterSpy.and.stub();
        service['drawPerimeter'](contextSpyObj, finalGrid);
        expect(drawPerimeterSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works even when there is a negative coordinate in x', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle']);
        const finalGrid: Vec2 = { x: 100, y: -100 };
        drawPerimeterSpy.and.stub();
        service['drawPerimeter'](contextSpyObj, finalGrid);
        expect(drawPerimeterSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });
});
