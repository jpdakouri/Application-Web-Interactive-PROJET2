import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { SelectionResizerService } from './selection-resizer.service';

fdescribe('SelectionResizerService', () => {
    let service: SelectionResizerService;
    let canvasTestHelper: CanvasTestHelper;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let drawing: DrawingService;
    // tslint:disable:no-any
    let resizeSelectionSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionResizerService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        drawing = TestBed.inject(DrawingService);
        drawing.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawing.previewCtx = previewCtxStub;
        drawing.selectedAreaCtx = selectedAreaCtxStub;
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        resizeSelectionSpy = spyOn<any>(service, 'resizeSelection').and.callThrough();

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButtons.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isResizing retuns false if status=off, true otherwise', () => {
        service.status = SelectionStatus.OFF;
        expect(service.isResizing()).toBeFalse();
        service.status = SelectionStatus.TOP_LEFT_BOX;
        expect(service.isResizing()).toBeTrue();
    });

    it('onMouseUp sets mouse down to false', () => {
        service.onMouseUp(new MouseEvent(''));
        expect(service['selectionMouseDown']).toBeFalse();
    });

    it('setStatus sets the status and initialises the resize', () => {
        service.setStatus(SelectionStatus.BOTTOM_LEFT_BOX);
        expect(service.status).toBe(SelectionStatus.BOTTOM_LEFT_BOX);
        expect(service.topLeftCorner).not.toBeUndefined();
    });

    it('updatePreview clears the canvas and draws', () => {
        spyOn(drawing, 'clearCanvas');
        service.updatePreview();
        expect(drawing.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
    });

    it('onMouseDown sets the coords', () => {
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('onMouseMove should change coords and call resizeSelection if status =/= OFF', () => {
        service['selectionMouseDown'] = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.status = SelectionStatus.TOP_LEFT_BOX;
        service.onMouseMove(mouseEvent);
        const expectedCoord = { x: 100, y: 100 };
        expect(service['coords']).toEqual(expectedCoord);
        expect(resizeSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call resizeSelection if status = OFF', () => {
        service['selectionMouseDown'] = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.status = SelectionStatus.OFF;
        service.onMouseMove(mouseEvent);
        expect(resizeSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should update shift state', () => {
        service['shiftDown'] = false;
        // tslint:disable:no-magic-numbers
        service['width'] = service['height'] = 100;
        selectedAreaCtxStub.canvas.height = selectedAreaCtxStub.canvas.width = 100;
        spyOn<any>(service, 'initialize').and.callThrough();

        service.mouseDownCoord = { x: 0, y: 0 };
        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('onKeyup should update shift state', () => {
        service['shiftDown'] = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);

        expect(service['shiftDown']).toBeFalse();
    });

    it('onKeyup not call updatePreview when shift is not down', () => {
        service['shiftDown'] = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        const updatePreviewSpy = spyOn<any>(service, 'updatePreview').and.stub();
        expect(updatePreviewSpy).not.toHaveBeenCalled();
    });
});
