import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { LineService } from './line.service';

// tslint:disable:no-any
describe('LineService', () => {
    const DETECTION_RANGE = 15;
    let service: LineService;
    let mouseEvent: MouseEvent;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        mouseEvent = {
            offsetX: 100,
            offsetY: 100,
            x: 100,
            y: 100,
            button: MouseButtons.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
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

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not down', () => {
        service.mouseDown = false;
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should not call desiredAngle if mouse was already down and shift not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const keyboardEventFalse = {
            key: KeyboardButtons.InvalidInput,
        } as KeyboardEvent;
        const desiredAngleSpy = spyOn<any>(service, 'desiredAngle').and.callThrough();

        service.onMouseUp(mouseEvent);
        service.onKeyDown(keyboardEventFalse);

        expect(desiredAngleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call desiredAngle if mouse was already down and shift pressed', () => {
        mouseEvent = {
            offsetX: 40,
            offsetY: 40,
            x: 100,
            y: 100,
            button: MouseButtons.Left,
        } as MouseEvent;
        // spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        service['pathData'].push({ x: 0, y: 0 });
        service.mouseDown = true;
        service['shiftPressed'] = true;
        const desiredAngleSpy = spyOn<any>(service, 'desiredAngle').and.callThrough();

        service.onMouseUp(mouseEvent);
        expect(desiredAngleSpy).toHaveBeenCalled();
    });

    it(' desiredAngle shoulld return the right value', () => {
        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: 2, y: -3 })).toEqual({ x: 2, y: -2 });

        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: -10, y: 7 })).toEqual({ x: -10, y: 10 });

        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: 1, y: -3 })).toEqual({ x: 0, y: -3 });
    });

    it('onMouseMove should call previewUpdate if the drawing has started', () => {
        service.mouseDown = true;
        const mouseStartEvent = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButtons.Left,
        } as MouseEvent;
        const previewUpdateSpy = spyOn<any>(service, 'previewUpdate').and.callThrough();
        service.onMouseUp(mouseStartEvent);
        service.onMouseMove(mouseEvent);

        expect(previewUpdateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call previewUpdate if the drawing has not started', () => {
        service.mouseDown = false;
        const previewUpdateSpy = spyOn<any>(service, 'previewUpdate').and.callThrough();
        service.onMouseMove(mouseEvent);

        expect(previewUpdateSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should stop the preview if drawing has started ', () => {
        service['pathData'].push({ x: 0, y: 0 });
        service['started'] = true;
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        service['lineThickness'] = undefined;
        service['dotRadius'] = undefined;
        service['showDots'] = true;
        service.onMouseLeave({
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onMouseLeave not should not call drawLine if drawing has not started ', () => {
        service['started'] = false;
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        service.onMouseLeave({
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onDblClick should adapt if last point is 20px close to start', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
        ];
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        service['pathData'].push({ x: 0, y: 0 });
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        // double click
        service['pathData'].push({ x: DETECTION_RANGE, y: -DETECTION_RANGE });
        service['pathData'].push({ x: DETECTION_RANGE, y: -DETECTION_RANGE });

        service.onDblClick();

        const expectedLineThickness = 5;
        expect(drawLineSpy).toHaveBeenCalledWith(
            jasmine.any(CanvasRenderingContext2D),
            '#000000',
            '#ffffff',
            false,
            expectedLineThickness,
            comparingArray,
            1,
            true,
        );
    });

    it(' onDblClick should adapt if last 2 points are 20px close', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
        ];
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        service.showDots = true;
        service.dotRadius = 1;

        service['pathData'].push({ x: 0, y: 0 });
        // double click
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        service['pathData'].push({ x: mouseEvent.offsetX + DETECTION_RANGE, y: mouseEvent.offsetY - DETECTION_RANGE });

        service.onDblClick();
        expect(drawLineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), '#000000', '#ffffff', true, 1, comparingArray, 1, false);
    });

    it(' onDblClick should do nothing if distance is greater than 20px', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
            { x: mouseEvent.offsetX + DETECTION_RANGE * 2, y: mouseEvent.offsetY - DETECTION_RANGE },
        ];
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        service['pathData'].push({ x: 0, y: 0 });
        // double click
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        service['pathData'].push({ x: mouseEvent.offsetX + DETECTION_RANGE * 2, y: mouseEvent.offsetY - DETECTION_RANGE });

        service.onDblClick();
        const expectedLineThickness = 5;
        expect(drawLineSpy).toHaveBeenCalledWith(
            jasmine.any(CanvasRenderingContext2D),
            '#000000',
            '#ffffff',
            false,
            expectedLineThickness,
            comparingArray,
            1,
            false,
        );
    });

    it(' keys should perform their task', () => {
        service['started'] = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);

        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftPressed']).toBeTrue();

        service.onKeyDown({
            key: KeyboardButtons.Escape,
        } as KeyboardEvent);
        expect(service['started']).toBeFalse();

        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Backspace });
        service.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();

        service.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('onKeyup should update shift state', () => {
        service['shiftPressed'] = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service['lineThickness'] = undefined;
        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);

        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftPressed']).toBeFalse();
    });

    it('onKeyup should not call previewUpdate if shift isnt pressed', () => {
        service['shiftPressed'] = false;
        const previewUpdateSpy = spyOn<any>(service, 'previewUpdate').and.callThrough();

        service.onKeyUp({
            key: KeyboardButtons.InvalidInput,
        } as KeyboardEvent);
        expect(previewUpdateSpy).not.toHaveBeenCalled();
    });
});
