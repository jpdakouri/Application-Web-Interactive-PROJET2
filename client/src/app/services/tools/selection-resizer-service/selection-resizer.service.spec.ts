import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { SelectionResizerService } from './selection-resizer.service';

describe('SelectionResizerService', () => {
    let service: SelectionResizerService;
    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let drawing: DrawingService;

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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('is resizing retuns false if off, true otherwise', () => {
        service.status = SelectionStatus.OFF;
        expect(service.isResizing()).toBeFalse();
        service.status = SelectionStatus.TOP_LEFT_BOX;
        expect(service.isResizing()).toBeTrue();
    });

    it('onmouseup calls method of mouse service and sets mouse down to false', () => {
        spyOn(TestBed.inject(MouseHandlerService), 'onMouseUp');
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

    it('onMouseDown calls onMouseDown from the mouse handler and sets the coords ', () => {
        spyOn(TestBed.inject(MouseHandlerService), 'onMouseDown');
        const expectedCoord = { x: 1, y: 1 };
        spyOn(service, 'getPositionFromMouse').and.returnValue(expectedCoord);
        service.onMouseDown(new MouseEvent('', { clientX: 1, clientY: 1 }));
        expect(service['coords']).toBe(expectedCoord);
        expect(service.mouseDownCoord).toBe(expectedCoord);
    });
});
