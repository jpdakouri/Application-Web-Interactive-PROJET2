import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButton, MouseButton } from '@app/utils/enums/list-boutton-pressed';
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
    let drawLineSpy: jasmine.Spy<any>;
    let previewUpdateSpy: jasmine.Spy<any>;
    let desiredAngleSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        previewUpdateSpy = spyOn<any>(service, 'previewUpdate').and.callThrough();
        desiredAngleSpy = spyOn<any>(service, 'desiredAngle').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 40,
            offsetY: 40,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 40, y: 40 };
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
            button: MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call desiredAngle if mouse was already down and shift not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const keyboardEventFalse = {
            key: KeyboardButton.InvalidInput,
        } as KeyboardEvent;

        service.onMouseUp(mouseEvent);
        service.onKeyDown(keyboardEventFalse);

        expect(desiredAngleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call desiredAngle if mouse was already down and shift pressed', () => {
        service['pathData'].push({ x: 0, y: 0 });
        service.mouseDown = true;
        service['shiftPressed'] = true;

        service.onMouseUp(mouseEvent);
        expect(desiredAngleSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call previewUpdate if the drawing has started', () => {
        service.mouseDown = true;
        const mouseStartEvent = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseUp(mouseStartEvent);
        service.onMouseMove(mouseEvent);

        expect(previewUpdateSpy).toHaveBeenCalled();
    });

    // canva size value to add
    it('onMouseLeave should stop the preview if drawing has started ', () => {
        service['pathData'].push({ x: 0, y: 0 });
        service['started'] = true;
        service.onMouseLeave({
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onDblClick should adapt if last point is 20px close to start', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
        ];

        service['pathData'].push({ x: 0, y: 0 });
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        // double click
        service['pathData'].push({ x: DETECTION_RANGE, y: -DETECTION_RANGE });
        service['pathData'].push({ x: DETECTION_RANGE, y: -DETECTION_RANGE });

        service.onDblClick();
        expect(drawLineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), comparingArray, true);
    });

    it(' onDblClick should adapt if last 2 points are 20px close', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
        ];
        service.showDots = true;
        service.dotRadius = 1;

        service['pathData'].push({ x: 0, y: 0 });
        // double click
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        service['pathData'].push({ x: mouseEvent.offsetX + DETECTION_RANGE, y: mouseEvent.offsetY - DETECTION_RANGE });

        service.onDblClick();
        expect(drawLineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), comparingArray, false);
    });

    it(' onDblClick should do nothing if distance is greater than 20px', () => {
        const comparingArray: Vec2[] = [
            { x: 0, y: 0 },
            { x: mouseEvent.offsetX, y: mouseEvent.offsetY },
            { x: mouseEvent.offsetX + DETECTION_RANGE * 2, y: mouseEvent.offsetY - DETECTION_RANGE },
        ];

        service['pathData'].push({ x: 0, y: 0 });
        // double click
        service['pathData'].push({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        service['pathData'].push({ x: mouseEvent.offsetX + DETECTION_RANGE * 2, y: mouseEvent.offsetY - DETECTION_RANGE });

        service.onDblClick();
        expect(drawLineSpy).toHaveBeenCalledWith(jasmine.any(CanvasRenderingContext2D), comparingArray, false);
    });

    it(' keys should perform their task', () => {
        service['started'] = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);

        service.onKeyDown({
            key: KeyboardButton.Shift,
        } as KeyboardEvent);
        expect(service['shiftPressed']).toBeTrue();

        service.onKeyDown({
            key: KeyboardButton.Escape,
        } as KeyboardEvent);
        expect(service['started']).toBeFalse();

        // TypeError: event.preventDefault is not a function
        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButton.Backspace });
        service.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('onKeyup should update shift state', () => {
        service['shiftPressed'] = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service['pathData'].push({ x: 0, y: 0 }, service.mouseDownCoord);

        service.onKeyUp({
            key: KeyboardButton.Shift,
        } as KeyboardEvent);
        expect(service['shiftPressed']).toBeFalse();
    });
});
