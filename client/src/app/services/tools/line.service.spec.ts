import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton, MouseButton } from '@app/list-boutton-pressed';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

// tslint:disable:no-any
describe('LineService', () => {
    const DETECTION_RANGE = 15;
    let service: LineService;
    let mouseEvent: MouseEvent;
    let mouseStartEvent: MouseEvent;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let previewUpdateSpy: jasmine.Spy<any>;
    let desiredAngleSpy: jasmine.Spy<any>;
    let verifyLastPointSpy: jasmine.Spy<any>;

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
        verifyLastPointSpy = spyOn<any>(service, 'verifyLastPoint').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseStartEvent = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
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
            key: KeyboardButton.RandomKey,
        } as KeyboardEvent;

        service.onMouseUp(mouseEvent);
        service.onKeyDown(keyboardEventFalse);

        expect(desiredAngleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call desiredAngle if mouse was already down and shift pressed', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.mouseDown = true;
        service['shiftPressed'] = true;

        service.onMouseUp(mouseEvent);
        expect(desiredAngleSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call previewUpdate if the drawing has started', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.onMouseMove(mouseEvent);

        expect(previewUpdateSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call desiredAngle if mouse was already down and shift pressed2', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.mouseDown = true;
        service['shiftPressed'] = true;
        service.onMouseMove(mouseEvent);

        expect(desiredAngleSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should call clearCanvas and drawLine if the line has started ', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.onMouseLeave({
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onDblClick should adapt if last point(s) are 20px close', () => {
        const surroundingCoords: number[][] = [
            [DETECTION_RANGE, 0],
            [-DETECTION_RANGE, 0],
            [0, DETECTION_RANGE],
            [0, -DETECTION_RANGE],
        ];
        for (const dot of surroundingCoords) {
            service.mouseDown = true;
            service.onMouseUp(mouseStartEvent);
            service.mouseDown = true;
            service.onMouseUp(mouseEvent);
            service.mouseDown = true;

            const lastDot = {
                offsetX: mouseEvent.offsetX + dot[0],
                offsetY: mouseEvent.offsetY + dot[1],
                button: MouseButton.Left,
            } as MouseEvent;

            service.mouseDown = true;
            service.onMouseUp(lastDot);
            service.mouseDown = true;
            service.onMouseUp(lastDot);
            service.mouseDown = true;
            service.onDblClick();

            expect(verifyLastPointSpy).toBeTruthy();
        }
    });

    // fit(' keys should perform their task', () => {
    //     service['pathData'].push({ x: 0, y: 0 }, { x: 20, y: 20 });

    //     const bS = {
    //         key: KeyboardButton.Backspace,
    //     } as KeyboardEvent;

    //     service.onKeyDown(bS);
    //     expect(service['pathData'].length).toEqual(1);
    //     service.onKeyDown(bS);
    //     expect(service['pathData'].length).toEqual(1);

    //     console.log(
    //         service.onKeyDown({
    //             key: KeyboardButton.Shift,
    //         } as KeyboardEvent),
    //     );
    //     expect(service['shiftPressed']).toBeTrue();
    //     service.onKeyDown({
    //         key: KeyboardButton.Escape,
    //     } as KeyboardEvent);
    //     expect(service['started']).toBeFalse();
    // });

    // it('onKeyup should update shift state', () => {
    //     service['shiftPressed'] = true;
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.onKeyUp({
    //         key: KeyboardButton.RandomKey,
    //     } as KeyboardEvent);
    //     expect(service['shiftPressed']).toBeTrue();
    //     service.onKeyUp({
    //         key: KeyboardButton.Shift,
    //     } as KeyboardEvent);
    //     expect(service['shiftPressed']).toBeFalse();
    // });
});
