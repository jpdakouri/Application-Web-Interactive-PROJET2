import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { MousePositionHandlerService } from '@app/services/tools/mousePositionHandler-service/mouse-position-handler.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ShapeStyle } from '@app/utils/enums/shape-style';

describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let serviceMousePositionHandler: MousePositionHandlerService;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-any

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        serviceMousePositionHandler = TestBed.inject(MousePositionHandlerService);

        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

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
            button: MouseButtons.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawRectangleSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        const drawRectangleSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawCircle if shift is down', () => {
        service['shiftDown'] = true;
        const drawCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawCircle if shift is not down', () => {
        service['shiftDown'] = false;
        const drawCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();
        service.onMouseUp(mouseEvent);
        expect(drawCircleSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not be called when mouse is not down', () => {
        service.mouseDown = false;
        const updatePreviewSpy = spyOn<any>(service, 'updatePreview').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(updatePreviewSpy).not.toHaveBeenCalled();
    });

    it(' keys should perform their task', () => {
        service.onKeyDown({
            key: KeyboardButtons.Escape,
        } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();

        const drawCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();
        service['shiftDown'] = false;
        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('onKeyup should update shift state', () => {
        service['shiftDown'] = true;
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);

        expect(service['shiftDown']).toBeFalse();
    });

    it('onKeyup not call updatePreview when shift is not down', () => {
        service['shiftDown'] = false;
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        const updatePreviewSpy = spyOn<any>(service, 'updatePreview').and.stub();
        expect(updatePreviewSpy).not.toHaveBeenCalled();
    });

    it('onKeyup should not update shift state if shiftDown is false', () => {
        service['firstGrid'] = { x: 10, y: 10 };
        service.mouseDownCoord = { x: 50, y: 50 };

        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('drawCircle should be called when shiftDown is true', () => {
        service.mouseDown = true;
        service['shiftDown'] = true;
        const drawCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('drawCircle should not be called when shiftDown is false ', () => {
        service.mouseDown = true;
        service['shiftDown'] = false;
        const drawCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();

        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawCircleSpy).not.toHaveBeenCalled();
    });

    it(' drawOutline should be called when no shapeStyle is selected', () => {
        service['shapeStyle'] = undefined;
        service.mouseDown = true;
        const drawOutlineSpy = spyOn<any>(service, 'drawOutline').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawOutlineSpy).toHaveBeenCalled();
    });

    it(' drawOutline should be called when shapeStyle Outline is selected', () => {
        service.mouseDown = true;
        service['lineThickness'] = undefined;
        service['shapeStyle'] = ShapeStyle.Outline;
        const drawOutlineSpy = spyOn<any>(service, 'drawOutline').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawOutlineSpy).toHaveBeenCalled();
    });

    it(' drawFilled should be called when shapeeStyke Filled is selected', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.Filled;
        service['lineThickness'] = undefined;
        const drawFilledSpy = spyOn<any>(service, 'drawFilled').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledSpy).toHaveBeenCalled();
    });

    it(' drawFilledOutline should be called when shapeeStyke  is selected', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.FilledOutline;
        service['lineThickness'] = undefined;
        const drawFilledOutlineSpy = spyOn<any>(service, 'drawFilledOutline').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledOutlineSpy).toHaveBeenCalled();
    });

    it(' drawPerimeter works even when there is a negative coordinate in x', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle']);
        const finalGrid: Vec2 = { x: -100, y: 100 };
        const drawPerimeterSpy = spyOn<any>(service, 'drawPerimeter').and.callThrough();
        service['drawPerimeter'](contextSpyObj, finalGrid);
        expect(drawPerimeterSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works even when there is a negative coordinate in y', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle']);
        const finalGrid: Vec2 = { x: 100, y: -100 };
        const drawPerimeterSpy = spyOn<any>(service, 'drawPerimeter').and.callThrough();
        service['drawPerimeter'](contextSpyObj, finalGrid);
        expect(drawPerimeterSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });
});
