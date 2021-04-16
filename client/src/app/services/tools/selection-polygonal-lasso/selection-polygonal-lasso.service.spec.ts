import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionCommand } from '@app/classes/tool-commands/selection-command';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { SelectionPolygonalLassoService } from './selection-polygonal-lasso.service';

describe('SelectionPolygonalLassoService', () => {
    let service: SelectionPolygonalLassoService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionPolygonalLassoService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable: no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectedAreaCtx = selectedAreaCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('registerUndo put undefined for final top left corner if no selection is made', () => {
        SelectionService.selectionActive = false;
        service.registerUndo(new ImageData(2, 2));
        const command = TestBed.inject(UndoRedoService)['commands'][0] as SelectionCommand;
        expect(command.finalTopLeftCorner).toBeUndefined();
    });

    it('executeCommand does nothing if the 2 top left corners of the command are undefined', () => {
        const command = new SelectionCommand(service, { x: 1, y: 1 }, new ImageData(1, 1));
        spyOn(baseCtxStub, 'fillRect');
        spyOn(baseCtxStub, 'drawImage');
        service.executeCommand(command);
        expect(baseCtxStub.fillRect).toHaveBeenCalledTimes(0);
        expect(baseCtxStub.drawImage).toHaveBeenCalledTimes(0);
    });
});
