import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

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
    let shitfDownSpy: jasmine.Spy<any>;

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
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.callThrough();
        shitfDownSpy = spyOn<Boolean>(service, 'shiftDown').and.callThrough();
        // updatePreviewSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();

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

    // it('onMouseMove should call previewUpdate if the drawing has started', () => {
    //     service.mouseDown = true;
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     const mouseStartEvent = {
    //         offsetX: 0,
    //         offsetY: 0,
    //         button: 1,
    //     } as MouseEvent;
    //     service.onMouseDown(mouseStartEvent);
    //     // service.onMouseUp(mouseStartEvent);
    //     service.onMouseMove(mouseEvent);
    //     expect(updatePreviewSpy).toHaveBeenCalled();
    // });

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

        // service.onKeyDown({
        //     key: KeyboardKeys.Shift,
        // } as KeyboardEvent);
        // expect(updatePreviewSpy).toHaveBeenCalled();
    });

    it('onKeyup should update shift state and change back square to rectangle', () => {
        service.onKeyUp({
            key: KeyboardKeys.Escape,
        } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('a square should be drawed in the first quadrant with drawSquare', () => {
        service.mouseDown = true;
        const mouseFirstQ: Vec2 = {
            x: 15,
            y: 25,
        };
        expect(drawSquareSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });
});
