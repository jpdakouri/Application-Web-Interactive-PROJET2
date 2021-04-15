import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolsNames } from '@app/utils/enums/tools-names';

import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
    let service: ClipboardService;
    let toolManager: ToolManagerService;
    let selectionTool: SelectionRectangleService;
    let drawing: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClipboardService);
        toolManager = TestBed.inject(ToolManagerService);
        selectionTool = TestBed.inject(SelectionRectangleService);

        const canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawing = TestBed.inject(DrawingService);

        const baseCanvasContext = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawing.baseCtx = baseCanvasContext;
        drawing.selectedAreaCtx = baseCanvasContext;
        drawing.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('If there is an selection, copy changes the content', () => {
        spyOn(selectionTool, 'getSelectionImageData').and.returnValue(new ImageData(2, 2));
        spyOn(selectionTool, 'hasSelection').and.returnValue(true);
        spyOn(toolManager, 'getCurrentSelectionTool').and.returnValue(selectionTool);
        service.copy();
        expect(selectionTool.getSelectionImageData).toHaveBeenCalledTimes(1);
    });

    it('No paste happens if the content is empty', () => {
        spyOn(selectionTool, 'setSelection');
        service.paste();
        expect(selectionTool.setSelection).toHaveBeenCalledTimes(0);
    });

    it('Paste happens if the clipboard has content', () => {
        spyOn(selectionTool, 'setSelection');
        // tslint:disable: no-string-literal
        service['clipboardContent'] = new ImageData(2, 2);
        spyOn(selectionTool, 'getSelectionImageData').and.returnValue(drawing.baseCtx.getImageData(0, 0, 1, 1));
        spyOn(selectionTool, 'hasSelection').and.returnValue(false);
        toolManager.emitToolChange(ToolsNames.SelectBox);
        service.paste();
        expect(selectionTool.setSelection).toHaveBeenCalledTimes(1);
    });

    it('paste: current tool is changed to rectangle selection if no selection tool is selected, selection is deselected if theres one', () => {
        spyOn(toolManager, 'emitToolChange');
        spyOn(selectionTool, 'deselect');
        spyOn(selectionTool, 'getSelectionImageData').and.returnValue(drawing.baseCtx.getImageData(0, 0, 1, 1));
        spyOn(selectionTool, 'hasSelection').and.returnValue(true);
        service['clipboardContent'] = new ImageData(2, 2);
        toolManager.currentTool = ToolsNames.Pencil;
        service.paste();
        expect(toolManager.emitToolChange).toHaveBeenCalledWith(ToolsNames.SelectBox);
        expect(selectionTool.deselect).toHaveBeenCalledTimes(1);
    });

    it('delete: selection only deselected if selection tool selected', () => {
        spyOn(selectionTool, 'deselect');
        toolManager.emitToolChange(ToolsNames.Pencil);
        service.delete();
        expect(selectionTool.deselect).toHaveBeenCalledTimes(0);
        toolManager.emitToolChange(ToolsNames.SelectBox);
        service.delete();
        expect(selectionTool.deselect).toHaveBeenCalledTimes(1);
    });

    it('cut: selection only cut if selection tool selected and with current a selection', () => {
        spyOn(selectionTool, 'deselect');
        toolManager.emitToolChange(ToolsNames.Pencil);
        service.delete();
        expect(selectionTool.deselect).toHaveBeenCalledTimes(0);
        toolManager.emitToolChange(ToolsNames.SelectBox);
        service.delete();
        expect(selectionTool.deselect).toHaveBeenCalledTimes(1);
    });

    it('hasContent returns true in presence of content', () => {
        expect(service.hasContent()).toBeFalse();
        service['clipboardContent'] = new ImageData(2, 2);
        expect(service.hasContent()).toBeTrue();
    });

    it('hasSelection: returns true if selection tool selection and has selection, false otherwise', () => {
        expect(service.hasSelection()).toBeFalse();
        toolManager.emitToolChange(ToolsNames.SelectBox);
        spyOn(selectionTool, 'hasSelection').and.returnValue(true);
        expect(service.hasSelection()).toBeTrue();
    });
});
