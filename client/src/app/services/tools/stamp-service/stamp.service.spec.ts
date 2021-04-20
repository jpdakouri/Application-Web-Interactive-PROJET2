import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { StampCommand } from '@app/classes/tool-commands/stamp-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { Stamp } from '@app/utils/enums/stamp';
import { StampService } from './stamp.service';

describe('StampService', () => {
    let service: StampService;
    let canvasContext: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawing: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawing = TestBed.inject(DrawingService);

        canvasContext = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawing.baseCtx = canvasContext;
        drawing.previewCtx = canvasContext;
        drawing.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('mouseDown does nothing if click is not left click', () => {
        const mouseEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 });
        service.onMouseDown(mouseEvent);
        expect(TestBed.inject(UndoRedoService).canUndoCommands()).toBeFalsy();
    });
    it('mouseDown adds a command if click is left click', () => {
        const mouseEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 });
        service.onMouseDown(mouseEvent);
        spyOn(window, 'createImageBitmap');
        expect(TestBed.inject(UndoRedoService).canUndoCommands()).toBeTrue();
    });
    it('mouseMove draws the image of the stamp on the precview canvas', () => {
        const mouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0, button: 2 });
        spyOn(canvasContext, 'drawImage');
        spyOn(canvasContext, 'rotate');
        spyOn(canvasContext, 'save');
        spyOn(canvasContext, 'restore');
        service.onMouseMove(mouseEvent);
        expect(canvasContext.drawImage).toHaveBeenCalled();
        expect(canvasContext.rotate).toHaveBeenCalled();
        expect(canvasContext.save).toHaveBeenCalled();
        expect(canvasContext.restore).toHaveBeenCalled();
    });
    it('onMouseWheelScroll changes the angle by a different amount for each direction of movement, and if alt is pressed or not', () => {
        const positiveBigMovementEvent = new WheelEvent('mousewheel', { deltaY: 1, altKey: false });
        const positiveSmallMovementEvent = new WheelEvent('mousewheel', { deltaY: 1, altKey: true });
        const negativeBigMovementEvent = new WheelEvent('mousewheel', { deltaY: -1, altKey: false });
        const negativeSmallMovementEvent = new WheelEvent('mousewheel', { deltaY: -1, altKey: true });
        service.onMouseWheelScroll(positiveBigMovementEvent);
        // tslint:disable: no-string-literal
        // tslint:disable-next-line: no-magic-numbers
        expect(service['rotationAngle']).toBe(15);
        service.onMouseWheelScroll(positiveSmallMovementEvent);
        // tslint:disable-next-line: no-magic-numbers
        expect(service['rotationAngle']).toBe(16);
        service.onMouseWheelScroll(negativeBigMovementEvent);
        expect(service['rotationAngle']).toBe(1);
        service.onMouseWheelScroll(negativeSmallMovementEvent);
        expect(service['rotationAngle']).toBe(0);
    });
    it('onMouseLeave clears the preview canvas', () => {
        spyOn(drawing, 'clearCanvas');
        service.onMouseLeave();
        expect(drawing.clearCanvas).toHaveBeenCalled();
    });
    it('executeCommand calls the same code as drawOnBase', () => {
        spyOn(drawing, 'clearCanvas');
        spyOn(canvasContext, 'save');
        spyOn(canvasContext, 'restore');
        const command = new StampCommand(service, 1, 0, { x: 0, y: 0 }, Stamp.House);
        service.executeCommand(command);

        expect(drawing.clearCanvas).toHaveBeenCalled();
        expect(canvasContext.save).toHaveBeenCalled();
        expect(canvasContext.restore).toHaveBeenCalled();
    });
});
