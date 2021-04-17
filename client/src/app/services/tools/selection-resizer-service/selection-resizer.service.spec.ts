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
    // let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mouseMoveEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let drawing: DrawingService;
    // tslint:disable:no-any
    let resizeSelectionSpy: jasmine.Spy<any>;

    beforeEach(() => {
        jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionResizerService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        drawing = TestBed.inject(DrawingService);
        drawing.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawing.previewCtx = previewCtxStub;
        service['drawingService'].selectedAreaCtx = selectedAreaCtxStub;
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
        spyOn<any>(service, 'updatePreview').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('onKeyup should update shift state', () => {
        service['shiftDown'] = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeFalse();
    });

    it('onKeyup call updatePreview when shift is not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['updatePreview']).toHaveBeenCalled();
    });

    it('resizeSelection should set the right values for TopLeftBox', () => {
        service.status = SelectionStatus.TOP_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for TopMiddleBox', () => {
        service.status = SelectionStatus.TOP_MIDDLE_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for TopRightBox', () => {
        service.status = SelectionStatus.TOP_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for MiddleRightBox', () => {
        service.status = SelectionStatus.MIDDLE_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasWidth']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomRightBox', () => {
        service.status = SelectionStatus.BOTTOM_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomMiddleBox', () => {
        service.status = SelectionStatus.BOTTOM_MIDDLE_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomLeftBox', () => {
        service.status = SelectionStatus.BOTTOM_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for MiddleLeftBox', () => {
        service.status = SelectionStatus.MIDDLE_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        spyOn<any>(service, 'updatePreview').and.stub();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('isSelectionNull should set selectionActive to false if widht=offset', () => {
        service['width'] = service['offset'].x;
        spyOn<any>(service, 'isSelectionNull').and.callThrough();
        expect(SelectionResizerService['selectionActive']).toBeFalse();
    });

    it('isMirror should call isMirrorRight and isMirrorBottom for TopLeftBox', () => {
        service.status = SelectionStatus.TOP_LEFT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorBottom for TopMiddleBox', () => {
        service.status = SelectionStatus.TOP_MIDDLE_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        service['isMirror']();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft and isMirrorBottom for TopRightBox', () => {
        service.status = SelectionStatus.TOP_RIGHT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft for MiddleRightBox', () => {
        service.status = SelectionStatus.MIDDLE_RIGHT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft and isMirrorTop for BottomRightBox', () => {
        service.status = SelectionStatus.BOTTOM_RIGHT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorTop').and.stub();
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorTop for BottomMiddleBox', () => {
        service.status = SelectionStatus.BOTTOM_MIDDLE_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorTop').and.stub();
        service['isMirror']();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorRight and isMirrorTop for BottomRLeftBox', () => {
        service.status = SelectionStatus.BOTTOM_LEFT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorTop').and.stub();
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorRight for MiddleLeftBox', () => {
        service.status = SelectionStatus.MIDDLE_LEFT_BOX;
        spyOn<any>(service, 'updatePreview').and.stub();
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
    });
});
