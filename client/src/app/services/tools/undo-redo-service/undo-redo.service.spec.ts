import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilCommand } from '@app/classes/tool-commands/pencil-command';
import { CanvasOverwriterService } from '@app/services/canvas-overwriter/canvas-overwriter.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';

import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
    let service: UndoRedoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UndoRedoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('undo places a command on the undone command stack, redo does the opposite', () => {
        const tool = TestBed.inject(PencilService);
        const position = { x: 1, y: 1 };
        const command = new PencilCommand(tool, 'rgba(0,0,0,1)', 1, [[position]]);
        const overwriter = TestBed.inject(CanvasOverwriterService);
        spyOn(overwriter, 'overwriteCanvasState').and.callFake(() => {
            return;
        });
        spyOn(tool, 'executeCommand').and.callFake(() => {
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

    it('save initial state saves the initial state of the canvas', () => {
        const drawing = TestBed.inject(DrawingService);
        const canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawing.canvas = canvasTestHelper.canvas;
        drawing.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.saveInitialState();
        const expectedColor = 'rgba(255,255,255,1)';
        let goodColorCount = 0;
        // tslint:disable-next-line: no-string-literal
        const initialState = service['initialCanvasColors'];
        const dimension = 100;
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                if (initialState[j][i] === expectedColor) goodColorCount += 1;
            }
        }
        expect(goodColorCount).toBe(dimension * dimension);
    });
    it('if a command cannot be undone or redone, the canvas is not redrawn', () => {
        const overwriter = TestBed.inject(CanvasOverwriterService);
        spyOn(overwriter, 'overwriteCanvasState');
        service.undo();
        service.redo();
        expect(overwriter.overwriteCanvasState).toHaveBeenCalledTimes(0);
    });
});
