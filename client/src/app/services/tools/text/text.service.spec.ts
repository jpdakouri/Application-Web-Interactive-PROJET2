import { TestBed } from '@angular/core/testing';

import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { TextAlign } from '@app/utils/enums/text-align.enum';
import { TextService } from './text.service';
import { TextFont } from '@app/utils/enums/text-font.enum';

fdescribe('TextService', () => {
    let service: TextService;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(TextService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should empty text and change showTextBox attribute to false if showTextBox is true', () => {
        const mockKeyboardEvent = { key: KeyboardButtons.Escape } as KeyboardEvent;
        const emptyText = '';
        service.showTextBox = true;
        service.onKeyDown(mockKeyboardEvent);

        expect(service.showTextBox).toBe(false);
        expect(service.text).toBe(emptyText);
    });

    it('#onKeyDown should not empty text and not change showTextBox attribute if showTextBox is false or if key is not escape', () => {
        const mockKeyboardEvent = { key: KeyboardButtons.Enter } as KeyboardEvent;
        const mockText = 'hello word';
        service.showTextBox = false;
        service.text = mockText;
        service.onKeyDown(mockKeyboardEvent);

        expect(service.showTextBox).toBe(false);
        expect(service.text).toBe(mockText);

        service.showTextBox = false;
        service.onKeyDown(mockKeyboardEvent);

        expect(service.showTextBox).toBe(false);
    });

    it('#onKeyUp should calculate new number of rows', () => {
        const mockKeyboardEvent = { key: KeyboardButtons.Enter } as KeyboardEvent;
        // @ts-ignore
        const calculateNumberOfLinesSpy = spyOn(service, 'calculateNumberOfLines').and.callThrough();
        service.onKeyUp(mockKeyboardEvent);
        expect(calculateNumberOfLinesSpy).toHaveBeenCalled();
    });

    it('#drawStyledTextOnCanvas should draw text with current style', () => {
        const position = { x: 100, y: 100 } as Vec2;
        const fillTextMultiLineSpy = spyOn(service, 'fillTextMultiLine').and.callThrough();
        const mockText = 'hello word';
        service.text = mockText;
        service.textBoxPosition = position;
        service.textAlign = TextAlign.Start;

        service.drawStyledTextOnCanvas();

        expect(fillTextMultiLineSpy).toHaveBeenCalledWith(drawingServiceSpy.baseCtx, mockText, position);
    });

    it('#drawStyledTextOnCanvas should not draw text on canvas if text is empty', () => {
        const fillTextMultiLineSpy = spyOn(service, 'fillTextMultiLine').and.callThrough();
        service.text = '';

        service.drawStyledTextOnCanvas();
        expect(fillTextMultiLineSpy).not.toHaveBeenCalled();
    });

    it('#calculateTextFinalPosition should correctly calculate text final position', () => {
        const position = { x: 100, y: 100 } as Vec2;
        const textArea = document.createElement('textarea');
        // textArea.cols = 20;
        // textArea.style.width = 33 + 'px';
        // const textAreaWidth = textArea.clientWidth;

        document.getElementById = jasmine.createSpy('textarea').and.returnValue(textArea);
        service.textAlign = TextAlign.Start;
        expect(service['calculateTextFinalPosition'](position)).toEqual(position);

        service.textAlign = TextAlign.Center;
        const expectedPosition = { x: 100, y: 100 } as Vec2;
        expect(service['calculateTextFinalPosition'](position)).toEqual(expectedPosition);

        service.textAlign = TextAlign.End;
        // expectedPosition = { x: 100, y: 100 } as Vec2;
        expect(service['calculateTextFinalPosition'](position)).toEqual(expectedPosition);
    });

    it('#calculateNumberOfLines should be able to calculate number of lines in a text', () => {
        const text = 'hello word \n from team 306';
        expect(service['calculateNumberOfLines'](text)).toEqual(2);
    });

    it('#splitTextInToLines should correctly split text in to lines', () => {
        const text = 'hello word\nfrom\nteam 306';
        const expectedLines = ['hello word', 'from', 'team 306'];
        expect(service['splitTextInToLines'](text)).toEqual(expectedLines);
    });

    // it('#calculateMaxLineLength should be able to correctly calculate max line length in a text ', () => {
    //     let text = 'hello word\nfrom\nteam 306';
    //     let expectedMaxLineLength = text.split('\n')[0].length;
    //     expect(service['calculateMaxLineLength'](text)).toEqual(expectedMaxLineLength);
    //
    //     text = 'hello \n word \n from team 306';
    //     expectedMaxLineLength = text.split('\n')[2].length;
    //     expect(service['calculateMaxLineLength'](text)).toEqual(expectedMaxLineLength);
    // });
    //
    // it('#calculateMaxLineLength should first line if maxLine is first line in the text', () => {
    //     const text = 'hello word\nfrom\nteam 306';
    //     const expectedMaxLineLength = text.split('\n')[0].length;
    //     expect(service['calculateMaxLineLength'](text)).toEqual(expectedMaxLineLength);
    // });

    it('#getSingleStyle should correctly get a single style from textStyles attribute', () => {
        service.textStyles = ['bold', 'italic'];

        expect(service.getSingleStyle('bold')).toEqual('bold');
        expect(service.getSingleStyle('')).not.toEqual('bold');
        expect(service.getSingleStyle('italic')).toEqual('italic');
    });

    it('#getCurrentStyle should correctly get current text style', () => {
        service.textStyles = ['bold', 'italic'];
        const expectedStyle = service.getCurrentStyle();
        const getSingleStyleSpy = spyOn(service, 'getSingleStyle').and.callThrough();

        expect(service.getCurrentStyle()).toEqual(expectedStyle);
        expect(getSingleStyleSpy).toHaveBeenCalledTimes(2);
    });

    it('#onMouseDwon should draw text on canvas if mouse click is out of canvas', () => {
        const mockMouseEvent = { x: 100, y: 100 } as MouseEvent;
        const drawStyledTextOnCanvasSpy = spyOn(service, 'drawStyledTextOnCanvas').and.callThrough();
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

        service.showTextBox = true;
        service.onMouseDown(mockMouseEvent);

        expect(drawStyledTextOnCanvasSpy).toHaveBeenCalled();
        expect(service.text).toBe('');
        expect(service.showTextBox).toBe(false);
        expect(service.textBoxPosition).toEqual({ x: 100, y: 100 });
    });

    it('#onMouseDwon should change showTextBox if mouse click is out of canvas', () => {});

    it('#fillTextMultiLine should be able to draw styled text in multi lines', () => {
        const fillTextSpy = spyOn(drawingServiceSpy.baseCtx, 'fillText').and.callThrough();
        const text = 'hello word from\nteam 306';
        const position = { x: 100, y: 100 } as Vec2;
        service.fontFace = TextFont.BrushScriptMT;
        service.textAlign = TextAlign.Center;
        service.fontSize = 2;

        service.fillTextMultiLine(drawingServiceSpy.baseCtx, text, position);

        expect(fillTextSpy).toHaveBeenCalledTimes(2);
        expect(drawingServiceSpy.baseCtx.font).toEqual('2px "Brush Script MT"');
        expect(drawingServiceSpy.baseCtx.textAlign).toEqual(service.textAlign);
    });

    it('#calculateFontHeight should ', () => {});

    it('#calculateTextBoxWidth should ', () => {});

    it('#onMouseDwon should ', () => {});
});
