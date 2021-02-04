import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton, MouseButton } from '@app/list-boutton-pressed';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

// tslint:disable:no-any
describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let mouseStartEvent: MouseEvent;
    // let keyboardEvent: KeyboardEvent;
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
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;

        mouseStartEvent = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;

        // keyboardEvent = {
        //     key: KeyboardButton.Shift,
        // } as KeyboardEvent;
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
            key: KeyboardButton.RandomLettre,
        } as KeyboardEvent;

        service.onMouseUp(mouseEvent);
        service.onKeyDown(keyboardEventFalse);

        expect(desiredAngleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call desiredAngle if mouse was already down and shift pressed', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.mouseDown = true;
        service.shiftPressed = true;

        service.onMouseUp(mouseEvent);
        expect(desiredAngleSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call previewUpdate if the drawing has started', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseStartEvent);
        service.onMouseMove(mouseEvent);

        expect(previewUpdateSpy).toHaveBeenCalled();
    });

    // it('onMouseUp should call desiredAngle if mouse was already down and shift pressed2', () => {
    //     service.mouseDown = true;
    //     const mouseEventRClick = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: MouseButton.Left,
    //     } as MouseEvent;
    //     service.onMouseUp(mouseEvent);
    //     service.onKeyDown(keyboardEvent);
    //     service.onMouseMove(mouseEventRClick);
    // });
});
// desiredAngle should return the closest point with sift key pressed
