import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EraserCommand } from '@app/classes/tool-commands/eraser-command';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let eraseSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);
        eraseSpy = spyOn<any>(service, 'erase').and.callThrough();
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
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
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call erase if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call erase if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call erase if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service['lineThickness'] = undefined;
        service.onMouseMove(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call erase if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseLeave should call erase if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' onMouseLeave should not call erase if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it('executeCommand draws a line for each point in path', () => {
        const command = new EraserCommand(service, 2, [
            [
                { x: 0, y: 0 },
                { x: 2, y: 2 },
            ],
        ]);
        spyOn(TestBed.inject(DrawingService).baseCtx, 'lineTo');
        service.executeCommand(command);
        expect(TestBed.inject(DrawingService).baseCtx.lineTo).toHaveBeenCalledTimes(2);
    });

    it('onmouseup uses default thickness if thickness is undefined, but uses set thickness if defined', () => {
        service['mouseDown'] = true;
        service.lineThickness = undefined;
        service.onMouseUp(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
        const expectedValue = 5;
        expect(TestBed.inject(DrawingService).baseCtx.lineWidth).toBe(expectedValue);
        const definedThickness = 10;
        service.lineThickness = definedThickness;
        service.onMouseUp(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
        expect(TestBed.inject(DrawingService).baseCtx.lineWidth).toBe(definedThickness / 2);
    });

    it('onmouseleave uses default thickness if thickness is undefined, but uses set thickness if defined', () => {
        service['mouseDown'] = true;
        service.lineThickness = undefined;
        service.onMouseLeave(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
        const expectedValue = 5;
        expect(TestBed.inject(DrawingService).baseCtx.lineWidth).toBe(expectedValue);
        const definedThickness = 15;
        service.lineThickness = definedThickness;
        service.onMouseLeave(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
        expect(TestBed.inject(DrawingService).baseCtx.lineWidth).toBe(definedThickness);
    });
});
