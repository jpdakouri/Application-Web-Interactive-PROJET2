import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilCommand } from '@app/classes/tool-commands/pencil-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';

import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let baseCanvasContext: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawing: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UndoRedoService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawing = TestBed.inject(DrawingService);

        baseCanvasContext = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawing.baseCtx = baseCanvasContext;
        drawing.canvas = canvasTestHelper.canvas;
        service.saveInitialState();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('undo places a command on the undone command stack, redo does the opposite', () => {
        const tool = TestBed.inject(PencilService);
        const position = { x: 1, y: 1 };
        const command = new PencilCommand(tool, 'rgba(0,0,0,1)', 1, [[position]]);
        spyOn(tool, 'executeCommand').and.callFake(() => {
            return;
        });
        spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.callFake(() => {
            return;
        });
        service.addCommand(command);
        expect(service.canUndoCommands()).toBeTrue();
        expect(service.canRedoCommands()).toBeFalse();
        service.undo();
        expect(service.canUndoCommands()).toBeFalse();
        expect(service.canRedoCommands()).toBeTrue();
        service.redo();
        expect(service.canUndoCommands()).toBeTrue();
        expect(service.canRedoCommands()).toBeFalse();
    });
    it('if a command cannot be undone or redone, the canvas is not redrawn', () => {
        drawing.canvas = canvasTestHelper.canvas;
        drawing.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(drawing.baseCtx, 'drawImage');

        service.undo();
        service.redo();
        expect(drawing.baseCtx.drawImage).toHaveBeenCalledTimes(0);
    });
    it('if a command can be done or undone, redrawCanvas is called, and all the commands that havent been undone are executed', () => {
        const pencil = TestBed.inject(PencilService);
        const command = new PencilCommand(pencil, '0,0,0,1', 1, []);
        service.addCommand(command);
        drawing.canvas = canvasTestHelper.canvas;
        drawing.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(drawing, 'clearCanvas');
        spyOn(pencil, 'executeCommand');
        spyOn(drawing.baseCtx, 'getImageData').and.returnValue(new ImageData(1, 1));
        service.undo();
        service.redo();
        expect(drawing.clearCanvas).toHaveBeenCalledTimes(2);
        expect(pencil.executeCommand).toHaveBeenCalledTimes(1);
    });
});
