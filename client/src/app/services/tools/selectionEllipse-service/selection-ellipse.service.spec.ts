import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { SelectionEllipseService } from './selection-ellipse.service';

describe('SelectionEllipseService', () => {
    let service: SelectionEllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(SelectionEllipseService);

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
        // service.mouseDown = true;
        service.selectionActive = true;

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
        service.selectionActive = true;
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
        service.mouseDown = service.selectionActive = service['dragActive'] = true;
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
        service.mouseDown = service.selectionActive = service.mouseMoved = true;
        service['dragActive'] = false;
        service.mouseDownCoord = { x: 100, y: 100 };
        // const grid = service.mouseDownCoord;
        service['firstGrid'] = { x: 100, y: 100 };
        service['begin'] = { x: 0, y: 0 };
        service['end'] = { x: 100, y: 100 };

        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
        expect(service.mouseMoved).toBeFalse();
        expect(service['dragActive']).toBeFalse();
    });

    it('Esc key should clear the canvas when pressed', () => {
        service.onKeyDown({
            key: KeyboardButtons.Escape,
        } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('Shift key should call makeCircle when pressed', () => {
        service.onMouseDown(mouseEvent);
        const makeCircleSpy = spyOn<any>(service, 'makeCircle').and.callThrough();
        service['shiftDown'] = false;
        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
        expect(makeCircleSpy).toHaveBeenCalled();
    });

    it('selected region should move 3px higher when Up key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Up,
        } as KeyboardEvent);
        expect(service.topLeftCorner.y).toEqual(197);
    });

    it('selected region should not move 3px higher when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Up,
        } as KeyboardEvent);
        expect(service.topLeftCorner.y).toEqual(200);
    });

    it('selected region should move 3px lower when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Down,
        } as KeyboardEvent);
        expect(service.topLeftCorner.y).toEqual(203);
    });

    it('selected region should not move 3px lower when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Down,
        } as KeyboardEvent);
        expect(service.topLeftCorner.y).toEqual(200);
    });

    it('selected region should move 3px to the right when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Right,
        } as KeyboardEvent);
        expect(service.topLeftCorner.x).toEqual(203);
    });

    it('selected region should not move 3px to the right when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Right,
        } as KeyboardEvent);
        expect(service.topLeftCorner.x).toEqual(200);
    });

    it('selected region should move 3px to the left when Down key is pressed during the selection', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = true;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Left,
        } as KeyboardEvent);
        expect(service.topLeftCorner.x).toEqual(197);
    });

    it('selected region should not move 3px to the left when Up key is pressed while there is no selection ', () => {
        service.onMouseDown(mouseEvent);
        service.selectionActive = false;

        service.topLeftCorner = { x: 200, y: 200 };
        service.onKeyDown({
            key: KeyboardButtons.Left,
        } as KeyboardEvent);
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

        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('updateLeftCorner() should be able to update topLeftCorner in any situation', () => {
        service.mouseDown = service.selectionActive = service.mouseMoved = true;
        service['dragActive'] = false;
        service.mouseDownCoord = { x: 100, y: 100 };
        // const grid = service.mouseDownCoord;
        service['firstGrid'] = { x: 100, y: 100 };
        service['begin'] = { x: 200, y: 200 };
        service['end'] = { x: 100, y: 100 };

        service.onMouseUp(mouseEvent);
        expect(service.topLeftCorner.x).toEqual(service['end'].x);
        expect(service.topLeftCorner.x).toEqual(service['end'].y);
    });

    // à revoir, le test le rentre pas dnas le if de shiftDown dans le mouseUp
    xit('makeCircle() should be called when the Shift key is being pressed during a mouseUp event', () => {
        service['shiftDown'] = service.mouseDown = service.selectionActive = service.mouseMoved = true;
        service['dragActive'] = false;
        const makeCircleSpy = spyOn<any>(service, 'makeCircle').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(makeCircleSpy).toHaveBeenCalled();
    });

    // ----//

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

    it('should draw rectangle/square in the first quadrant (+/+)', () => {
        service.mouseDownCoord = { x: 300, y: 200 };
        service['shiftDown'] = true;
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val);
        expect(val).toEqual(expected);
    });

    it('should draw a wide (height < width) rectangle/square in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -300, y: 200 };
        const expected = { x: -200, y: 200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeCircle'](value);
        expect(service['makeCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the fourth quadrant (+/-) ', () => {
        service.mouseDownCoord = { x: 300, y: -200 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeCircle'](value);
        expect(service['makeCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the second quadrant (-/-)', () => {
        service.mouseDownCoord = { x: -300, y: -200 };
        const expected = { x: -200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeCircle'](value);
        expect(service['makeCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a large (height > width) rectangle/square in the fourth quadrant (+/-)', () => {
        service.mouseDownCoord = { x: 200, y: -300 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeCircle'](value);
        expect(service['makeCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });
});
