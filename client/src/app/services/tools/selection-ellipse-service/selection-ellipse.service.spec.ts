import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionCommand } from '@app/classes/tool-commands/selection-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { MousePositionHandlerMock } from '@app/utils/tests-mocks/mouse-position-handler-mock';
import { SelectionEllipseService } from './selection-ellipse.service';

describe('SelectionEllipseService', () => {
    let service: SelectionEllipseService;
    let serviceMousePositionHandler: MousePositionHandlerService;

    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let mouseHanlerMock: MousePositionHandlerMock;

    beforeEach(() => {
        mouseHanlerMock = new MousePositionHandlerMock();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MousePositionHandlerService, useValue: mouseHanlerMock },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(SelectionEllipseService);
        serviceMousePositionHandler = TestBed.inject(MousePositionHandlerService);

        // tslint:disable-next-line:no-any
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectedAreaCtx = selectedAreaCtxStub;

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

    it(' mouseDown should activate the selection when isClickIn is true', () => {
        SelectionService.selectionActive = true;

        service.topLeftCorner = { x: 20, y: 20 };
        service.mouseDownCoord = { x: 300, y: 300 };

        const grid = service.mouseDownCoord;
        const mouseEventLClick = {
            button: MouseButtons.Left,
        } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        expect(service['isClickIn'](grid)).toEqual(true);
    });

    it(' mouseDown should not activate the selection when isClickIn is false', () => {
        SelectionService.selectionActive = true;
        // tslint:disable:no-magic-numbers
        service.height = service.width = 100;
        service.topLeftCorner = { x: 200, y: 200 };
        service.mouseDownCoord = { x: 30, y: 30 };
        const grid = service.mouseDownCoord;
        const mouseEventLClick = {
            button: MouseButtons.Left,
        } as MouseEvent;

        expect(service['isClickIn'](grid)).toEqual(false);
        service.onMouseDown(mouseEventLClick);
    });

    it('onMouseMove should call updatePreview when mouse is down', () => {
        // tslint:disable:no-any
        const updatePreviewSpy = spyOn<any>(service, 'updatePreview').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(updatePreviewSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call updateDragPosition when mouse is down and is currently selecting', () => {
        const updateDragPositionSpy = spyOn<any>(service, 'updateDragPosition').and.callThrough();
        service.mouseDown = SelectionService.selectionActive = service['dragActive'] = true;
        const grid = (service.mouseDownCoord = { x: 100, y: 100 });
        service.height = service.width = 100;
        service.onMouseDown(mouseEvent);

        const mouseEventLClick = {
            x: 100,
            y: 100,
            button: MouseButtons.Left,
        } as MouseEvent;
        service.onMouseMove(mouseEventLClick);
        expect(updateDragPositionSpy).toHaveBeenCalledWith(grid);
    });

    it(' onMouseUp should call drawEllipse and selectEllipse if mouse was already down', () => {
        service.mouseDown = SelectionService.selectionActive = service.mouseMoved = true;
        service['dragActive'] = false;
        service.mouseDownCoord = { x: 100, y: 100 };
        // const grid = service.mouseDownCoord;
        service['firstGrid'] = { x: 100, y: 100 };
        service['firstGridClip'] = { x: 0, y: 0 };
        service['finalGridClip'] = { x: 100, y: 100 };

        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
        expect(service.mouseMoved).toBeFalse();
        expect(service['dragActive']).toBeFalse();
    });

    it('Esc key should clear the canvas when pressed', () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Escape });
        SelectionService.selectionActive = true;
        service.onKeyDown(keyBordPrevent);
        expect(SelectionService.selectionActive).toBe(false);
    });

    it('Shift key should call makeCircle when pressed', () => {
        service.onMouseDown(mouseEvent);
        const makeCircleSpy = spyOn<any>(serviceMousePositionHandler, 'makeCircle').and.callThrough();
        service['shiftDown'] = true;
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Shift });
        service.onKeyDown(keyBordPrevent);
        expect(service['shiftDown']).toBeTrue();
        expect(makeCircleSpy).toHaveBeenCalled();
    });

    it('selected region should move 3px higher when Up key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Up });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.y).toEqual(197);
    });

    it('selected region should not move 3px higher when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Up });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.y).toEqual(200);
    });

    it('selected region should move 3px lower when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Down });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.y).toEqual(203);
    });

    it('selected region should not move 3px lower when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Down });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.y).toEqual(200);
    });

    it('selected region should move 3px to the right when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Right });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.x).toEqual(203);
    });

    it('selected region should not move 3px to the right when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Right });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.x).toEqual(200);
    });

    it('selected region should move 3px to the left when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Left });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.x).toEqual(197);
    });

    it('selected region should not move 3px to the left when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        SelectionService.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Left });
        service.onKeyDown(keyBordPrevent);
        expect(service.topLeftCorner.x).toEqual(200);
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
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Shift });
        service.onKeyDown(keyBordPrevent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('updateLeftCorner() should be able to update topLeftCorner in any situation', () => {
        service.mouseDown = SelectionService.selectionActive = service.mouseMoved = true;
        service['dragActive'] = false;
        service.mouseDownCoord = { x: 100, y: 100 };
        service['firstGrid'] = { x: 100, y: 100 };
        service['firstGridClip'] = { x: 200, y: 200 };
        service['finalGridClip'] = { x: 100, y: 100 };

        service.onMouseUp(mouseEvent);
        expect(service.topLeftCorner.x).toEqual(service['finalGridClip'].x);
        expect(service.topLeftCorner.x).toEqual(service['finalGridClip'].y);
    });

    it(' isClickIn() should return false when coordinates on MouseDown are on the left side of the selected region', () => {
        service.topLeftCorner = { x: 200, y: 200 };
        service.mouseDownCoord = { x: 100, y: 100 };
        const grid = service.mouseDownCoord;
        expect(service['isClickIn'](grid)).toEqual(false);
    });

    it(' isClickIn() should return false when coordinates on MouseDown are on the right side of the selected region', () => {
        service.topLeftCorner = { x: 200, y: 200 };
        service.mouseDownCoord = { x: 300, y: 100 };
        const grid = service.mouseDownCoord;
        expect(service['isClickIn'](grid)).toEqual(false);
    });

    it('executeCommand calls the ellipse function for clipping', () => {
        spyOn(TestBed.inject(DrawingService).baseCtx, 'ellipse');
        const data = new ImageData(1, 1);
        const command = new SelectionCommand(service, { x: 0, y: 0 }, data, { x: 1, y: 1 }, { x: 2, y: 2 });
        service.executeCommand(command);
        expect(TestBed.inject(DrawingService).baseCtx.ellipse).toHaveBeenCalledWith(1, 1, 0, 0, 0, 0, 2 * Math.PI, false);
    });
});
