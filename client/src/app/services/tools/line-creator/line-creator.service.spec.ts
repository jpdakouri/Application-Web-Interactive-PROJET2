import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { LineCreatorService } from './line-creator.service';

describe('LineCreatorService', () => {
    let service: LineCreatorService;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: DrawingService, useValue: drawServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineCreatorService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        // tslint:disable:no-any
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

    it(' keys should perform their task', () => {
        service.started = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
        // tslint:disable:no-any
        spyOn<any>(service, 'updatePreview').and.stub();
        let keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Shift });
        service.onKeyDown(keyBordPrevent);
        expect(service.shiftDown).toBeTrue();

        spyOn<any>(service, 'defaultOnKeyDown').and.stub();
        keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Escape });
        service.onKeyDown(keyBordPrevent);
        expect(service.started).toBeFalse();

        service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
        keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Backspace });
        service.onKeyDown(keyBordPrevent);
        expect(service['updatePreview']).toHaveBeenCalled();
    });

    it(' backspace should perform his task', () => {
        service.started = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
        // tslint:disable:no-any
        spyOn<any>(service, 'updatePreview').and.stub();

        service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Backspace });
        service.onKeyDown(keyBordPrevent);
        expect(service['updatePreview']).toHaveBeenCalled();
    });

    it(' desiredAngle shoulld return the right value', () => {
        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: 2, y: -3 })).toEqual({ x: 2, y: -2 });

        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: -10, y: 7 })).toEqual({ x: -10, y: 10 });

        service['pathData'].push({ x: 0, y: 0 });
        expect(service['desiredAngle']({ x: 1, y: -3 })).toEqual({ x: 0, y: -3 });
    });

    it('mouseDown should call the defaultMouseDown if there is a selection', () => {
        SelectionService.selectionActive = true;
        spyOn<any>(service, 'defaultOnMouseDown').and.stub();
        service.onMouseDown({ button: MouseButtons.Left } as MouseEvent);

        expect(service.defaultOnMouseDown).toHaveBeenCalled();
    });
});
