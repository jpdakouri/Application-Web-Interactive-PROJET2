import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { MockSelectionEllipseService } from '@app/utils/tests-mocks/selection-ellipse-service-mock';
import { MockSelectionPolygonaleService } from '@app/utils/tests-mocks/selection-polygonale-service-mock';
import { MockSelectionRectangleService } from '@app/utils/tests-mocks/selection-rectangle-service-mock';
// import { of } from 'rxjs';
import { SelectionResizerService } from './selection-resizer.service';

fdescribe('SelectionResizerService', () => {
    let service: SelectionResizerService;
    let canvasTestHelper: CanvasTestHelper;
    let mouseEvent: MouseEvent;
    let selectionRectangleMock: MockSelectionRectangleService;
    let selectionEllipseMock: MockSelectionEllipseService;
    let selectionPolygoneMock: MockSelectionPolygonaleService;
    let mouseMoveEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let drawing: DrawingService;
    let currentColorService: CurrentColorService;
    let mousePositionHandlerService: MousePositionHandlerService;
    let undoRedo: UndoRedoService;
    // tslint:disable:no-any
    let resizeSelectionSpy: jasmine.Spy<any>;
    let imageBitmap: jasmine.SpyObj<ImageBitmap>;

    beforeEach(() => {
        jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        service = TestBed.inject(SelectionResizerService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable:no-string-literal
        drawing = TestBed.inject(DrawingService);
        currentColorService = TestBed.inject(CurrentColorService);
        mousePositionHandlerService = TestBed.inject(MousePositionHandlerService);
        undoRedo = TestBed.inject(UndoRedoService);
        drawing.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawing.previewCtx = previewCtxStub;
        service['drawingService'].selectedAreaCtx = selectedAreaCtxStub;
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        resizeSelectionSpy = spyOn<any>(service, 'resizeSelection').and.callThrough();
        imageBitmap = jasmine.createSpyObj('ImageBitmap', ['close']);
        spyOn(self, 'createImageBitmap').and.resolveTo(imageBitmap);
        selectionRectangleMock = new MockSelectionRectangleService(drawing, currentColorService, mousePositionHandlerService, undoRedo);
        selectionEllipseMock = new MockSelectionEllipseService(drawing, currentColorService, mousePositionHandlerService, undoRedo);
        selectionPolygoneMock = new MockSelectionPolygonaleService(drawing, currentColorService, undoRedo);
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
        spyOn<any>(service, 'drawSelection').and.stub();
        service.updatePreview();
        expect(service['drawSelection']).toHaveBeenCalled();
        expect(drawing.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
    });

    it('onMouseDown sets the coords', () => {
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.registerUndo(service['imageData']);
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
        spyOn<any>(service, 'updatePreview').and.stub();
        service['shiftDown'] = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onKeyDown({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeTrue();
    });

    it('onKeyup should update shift state', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service['shiftDown'] = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['shiftDown']).toBeFalse();
    });

    it('onKeyup call updatePreview when shift is not down', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onKeyUp({
            key: KeyboardButtons.Shift,
        } as KeyboardEvent);
        expect(service['updatePreview']).toHaveBeenCalled();
    });

    it('resizeSelection should set the right values for TopLeftBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.TOP_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for TopMiddleBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.TOP_MIDDLE_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for TopRightBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.TOP_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for MiddleRightBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.MIDDLE_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasWidth']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomRightBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.BOTTOM_RIGHT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomMiddleBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.BOTTOM_MIDDLE_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
    });

    it('resizeSelection should set the right values for BottomLeftBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.BOTTOM_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasHeight']).toEqual(expectedResult);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    it('resizeSelection should set the right values for MiddleLeftBox', () => {
        spyOn<any>(service, 'updatePreview').and.stub();
        service.status = SelectionStatus.MIDDLE_LEFT_BOX;
        service.mouseDownCoord = { x: 0, y: 0 };
        mouseMoveEvent = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButtons.Left,
        } as MouseEvent;
        const expectedResult = 100;
        const expectedTopLeftCorner = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        expect(service['canvasWidth']).toEqual(expectedResult);
        expect(service['topLeftCorner']).toEqual(expectedTopLeftCorner);
    });

    // tslint:disable:no-magic-numbers
    it('isSelectionNull should set selectionActive to false if widht or height equal to offset', () => {
        service['width'] = 10;
        service['offset'].x = 10;
        service['isSelectionNull']();
        expect(SelectionResizerService['selectionActive']).toBeFalse();
        service['width'] = -10;
        service['offset'].x = 10;
        service['isSelectionNull']();
        expect(SelectionResizerService['selectionActive']).toBeFalse();
        service['height'] = 10;
        service['offset'].y = 10;
        service['isSelectionNull']();
        expect(SelectionResizerService['selectionActive']).toBeFalse();
        service['height'] = -10;
        service['offset'].y = 10;
        service['isSelectionNull']();
        expect(SelectionResizerService['selectionActive']).toBeFalse();
    });

    it('isSelectionNull should set selectionActive to true if widht or height is not equal to offset', () => {
        service['width'] = 20;
        service['offset'].x = 10;
        service['isSelectionNull']();
        service['height'] = 20;
        service['offset'].y = 10;
        service['isSelectionNull']();
        expect(SelectionResizerService['selectionActive']).toBeTrue();
    });

    // it('canvas.scale is called with the good parameters', () => {
    //     // selectedAreaCtxStub.canvas.width = 50;
    //     // selectedAreaCtxStub.canvas.height = 50;
    //     // service['initialize']();
    //     service['drawingService'].selectedAreaCtx = selectedAreaCtxStub;
    //     service.imageData = ('addoje' as unknown) as ImageData;
    //     spyOn<any>(service, 'isMirror').and.stub();
    //     spyOn<any>(service, 'isSelectionNull').and.stub();
    //     spyOn<any>(service, 'isSquare').and.stub();
    //     spyOn<any>(drawing, 'clearCanvas').and.stub();
    //     spyOn<any>(drawing.selectedAreaCtx, 'scale');
    //     // spyOn(window, 'createImageBitmap');
    //     spyOn<any>(window, 'createImageBitmap').and.callFake(() => {
    //         return;
    //     });
    //     service['canvasHeight'] = 50;
    //     service['revertX'] = true;
    //     service['revertY'] = true;
    //     service['updatePreview']();
    //     expect(service['drawingService'].selectedAreaCtx.canvas.height).toEqual(50);
    //     // setTimeout(() => {
    //     //     // tslint:disable-next-line:prettier
    //     //     expect(drawing.selectedAreaCtx.scale).toHaveBeenCalledWith(-1, -1);}, 500);
    // });

    it('isMirror should call isMirrorRight and isMirrorBottom for TopLeftBox', () => {
        service.status = SelectionStatus.TOP_LEFT_BOX;
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorBottom for TopMiddleBox', () => {
        service.status = SelectionStatus.TOP_MIDDLE_BOX;
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        service['isMirror']();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft and isMirrorBottom for TopRightBox', () => {
        service.status = SelectionStatus.TOP_RIGHT_BOX;
        spyOn<any>(service, 'isMirrorBottom').and.stub();
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
        expect(service['isMirrorBottom']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft for MiddleRightBox', () => {
        service.status = SelectionStatus.MIDDLE_RIGHT_BOX;
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorLeft and isMirrorTop for BottomRightBox', () => {
        service.status = SelectionStatus.BOTTOM_RIGHT_BOX;
        spyOn<any>(service, 'isMirrorTop').and.stub();
        spyOn<any>(service, 'isMirrorLeft').and.stub();
        service['isMirror']();
        expect(service['isMirrorLeft']).toHaveBeenCalled();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorTop for BottomMiddleBox', () => {
        service.status = SelectionStatus.BOTTOM_MIDDLE_BOX;
        spyOn<any>(service, 'isMirrorTop').and.stub();
        service['isMirror']();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorRight and isMirrorTop for BottomRLeftBox', () => {
        service.status = SelectionStatus.BOTTOM_LEFT_BOX;
        spyOn<any>(service, 'isMirrorTop').and.stub();
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
        expect(service['isMirrorTop']).toHaveBeenCalled();
    });

    it('isMirror should call isMirrorRight for MiddleLeftBox', () => {
        service.status = SelectionStatus.MIDDLE_LEFT_BOX;
        spyOn<any>(service, 'isMirrorRight').and.stub();
        service['isMirror']();
        expect(service['isMirrorRight']).toHaveBeenCalled();
    });

    it('isMirrorTop should set the right value to topLeftCorner and revertY to true or false depending on coords value', () => {
        service['revertY'] = false;
        service['isMirrorTop']();
        expect(service['revertY']).toBeFalse();
        service.initialTopLeftCorner = { x: 0, y: 20 };
        service['coords'].y = 25;
        service['isMirrorTop']();
        expect(service['revertY']).toBeFalse();
        const expectedResult = 15;
        service['coords'].y = 15;
        service['isMirrorTop']();
        expect(service.topLeftCorner.y).toEqual(expectedResult);
        expect(service['revertY']).toBeTrue();
    });

    it('isMirrorBottom should set the right value to topLeftCorner and revertY to true or false depending on coords value', () => {
        service['initialBottomRightCorner'] = { x: 0, y: 20 };
        service['coords'].y = 15;
        service['isMirrorBottom']();
        expect(service['revertY']).toBeFalse();
        const expectedResult = 20;
        service['coords'].y = 25;
        service['isMirrorBottom']();
        expect(service.topLeftCorner.y).toEqual(expectedResult);
        expect(service['revertY']).toBeTrue();
    });

    it('isMirrorLeft should set the right value to topLeftCorner and revertX to true or false depending on coords value', () => {
        service['revertX'] = false;
        service['isMirrorLeft']();
        expect(service['revertX']).toBeFalse();
        service.initialTopLeftCorner = { x: 20, y: 0 };
        service['coords'].x = 25;
        service['isMirrorLeft']();
        expect(service['revertX']).toBeFalse();
        const expectedResult = 15;
        service['coords'].x = 15;
        service['isMirrorLeft']();
        expect(service.topLeftCorner.x).toEqual(expectedResult);
        expect(service['revertX']).toBeTrue();
    });

    it('isMirrorRight should set the right value to topLeftCorner and revertX to true or false depending on coords value', () => {
        service['initialBottomRightCorner'] = { x: 20, y: 0 };
        service['coords'].x = 15;
        service['isMirrorRight']();
        expect(service['revertX']).toBeFalse();
        const expectedResult = 20;
        service['coords'].x = 25;
        service['isMirrorRight']();
        expect(service.topLeftCorner.x).toEqual(expectedResult);
        expect(service['revertX']).toBeTrue();
    });

    it('isSquare should set the right values for TopLeftBox', () => {
        service.initialTopLeftCorner = { x: 0, y: 0 };
        service['shiftDown'] = true;
        service.status = SelectionStatus.TOP_LEFT_BOX;
        service['canvasWidth'] = 20;
        service['canvasHeight'] = 15;
        service['initialBottomRightCorner'] = { x: 50, y: 50 };
        let expectedResultX = 50;
        let expectedResultY = 50;
        service['revertX'] = true;
        service['revertY'] = true;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service.topLeftCorner.y).toEqual(expectedResultY);
        service['revertX'] = false;
        service['revertY'] = false;
        const expectedWidth = 15;
        const expectedHeight = 15;
        expectedResultX = 35;
        expectedResultY = 35;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service.topLeftCorner.y).toEqual(expectedResultY);
        expect(service['canvasWidth']).toEqual(expectedWidth);
        expect(service['canvasHeight']).toEqual(expectedHeight);
    });

    it('isSquare should set the right values for TopRightBox', () => {
        service.initialTopLeftCorner = { x: 50, y: 50 };
        service['shiftDown'] = true;
        service.status = SelectionStatus.TOP_RIGHT_BOX;
        service['canvasWidth'] = 20;
        service['canvasHeight'] = 15;
        service['initialBottomRightCorner'] = { x: 100, y: 100 };
        let expectedResultX = 50;
        service['revertX'] = true;
        const expectedWidth = 15;
        const expectedHeight = 15;
        expectedResultX = 35;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service['canvasWidth']).toEqual(expectedWidth);
        expect(service['canvasHeight']).toEqual(expectedHeight);
    });

    it('isSquare should set the right values for BottomRightBox', () => {
        service.initialTopLeftCorner = { x: 0, y: 0 };
        service['shiftDown'] = true;
        service.status = SelectionStatus.BOTTOM_RIGHT_BOX;
        service['canvasWidth'] = 20;
        service['canvasHeight'] = 15;
        service['initialBottomRightCorner'] = { x: 50, y: 50 };
        let expectedResultX = -15;
        let expectedResultY = -15;
        service['revertX'] = true;
        service['revertY'] = true;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service.topLeftCorner.y).toEqual(expectedResultY);
        service['revertX'] = false;
        service['revertY'] = false;
        const expectedWidth = 15;
        const expectedHeight = 15;
        expectedResultX = 0;
        expectedResultY = 0;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service.topLeftCorner.y).toEqual(expectedResultY);
        expect(service['canvasWidth']).toEqual(expectedWidth);
        expect(service['canvasHeight']).toEqual(expectedHeight);
    });

    it('isSquare should set the right values for BottomLeftBox', () => {
        service.initialTopLeftCorner = { x: 0, y: 0 };
        service['shiftDown'] = true;
        service.status = SelectionStatus.BOTTOM_LEFT_BOX;
        service['canvasWidth'] = 20;
        service['canvasHeight'] = 15;
        service['initialBottomRightCorner'] = { x: 50, y: 50 };
        let expectedResultX = 50;
        const expectedResultY = -15;
        service['revertX'] = true;
        service['revertY'] = true;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service.topLeftCorner.y).toEqual(expectedResultY);
        service['revertX'] = false;
        const expectedWidth = 15;
        const expectedHeight = 15;
        expectedResultX = 35;
        service['isSquare']();
        expect(service.topLeftCorner.x).toEqual(expectedResultX);
        expect(service['canvasWidth']).toEqual(expectedWidth);
        expect(service['canvasHeight']).toEqual(expectedHeight);
    });

    it('updateValues should set the correct values to the selectionRectangleService', () => {
        drawing.selectedAreaCtx.canvas.style.left = 0 + 'px';
        drawing.selectedAreaCtx.canvas.style.top = 0 + 'px';
        drawing.selectedAreaCtx.canvas.height = 50;
        drawing.selectedAreaCtx.canvas.width = 50;
        service.updateValues(selectionRectangleMock);
        expect(selectionRectangleMock.topLeftCorner.x).toEqual(0);
        expect(selectionRectangleMock.topLeftCorner.y).toEqual(0);
        expect(selectionRectangleMock.height).toEqual(50);
        expect(selectionRectangleMock.width).toEqual(50);
    });

    it('updateValues should set the correct values to the selectionEllipseService', () => {
        spyOn<any>(drawing, 'clearCanvas').and.stub();
        drawing.selectedAreaCtx.canvas.style.left = 0 + 'px';
        drawing.selectedAreaCtx.canvas.style.top = 0 + 'px';
        drawing.selectedAreaCtx.canvas.height = 50;
        drawing.selectedAreaCtx.canvas.width = 50;
        service.updateValues(selectionEllipseMock);
        expect(selectionEllipseMock.topLeftCorner.x).toEqual(0);
        expect(selectionEllipseMock.topLeftCorner.y).toEqual(0);
        expect(selectionEllipseMock.height).toEqual(50);
        expect(selectionEllipseMock.width).toEqual(50);
    });

    it('updateValues should set the correct values to the selectionPolygonalService', () => {
        drawing.selectedAreaCtx.canvas.style.left = 0 + 'px';
        drawing.selectedAreaCtx.canvas.style.top = 0 + 'px';
        drawing.selectedAreaCtx.canvas.height = 50;
        drawing.selectedAreaCtx.canvas.width = 50;
        service.updateValues(selectionPolygoneMock);
        expect(selectionPolygoneMock.topLeftCorner.x).toEqual(0);
        expect(selectionPolygoneMock.topLeftCorner.y).toEqual(0);
        expect(selectionPolygoneMock.height).toEqual(50);
        expect(selectionPolygoneMock.width).toEqual(50);
    });
    // tslint:disable-next-line:max-file-line-count
});
