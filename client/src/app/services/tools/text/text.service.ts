import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_FONT_SIZE, FONT_HEIGHT_FACTOR } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { TextAlign } from '@app/utils/enums/text-align.enum';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    text: string;
    textAlign: TextAlign = TextAlign.Start;
    fontStyle: string;
    textStyles: string[];
    showTextBox: boolean;
    textBoxPosition: Vec2;
    textBoxSize: Vec2;
    numberOfRows: number;

    constructor(public currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        this.text = '';
        this.textAlign = TextAlign.Start;
        this.textStyles = [];
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.fontStyle = '';
        this.showTextBox = false;
        // this.textBoxSize = { x: DEFAULT_TEXT_BOX_WIDTH, y: DEFAULT_TEXT_BOX_HEIGHT };
        this.textBoxSize = { x: 0, y: 0 };
        this.textBoxPosition = { x: 0, y: 0 };
        this.numberOfRows = 1;
    }

    onKeyDown(event: KeyboardEvent): void {
        console.log(this.text);
        if (event.key === KeyboardButtons.Escape && this.showTextBox) {
            this.showTextBox = false;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.numberOfRows = this.calculateNumberOfLines();
        // const textArea = document.getElementById('textArea') as HTMLTextAreaElement;
        // console.log(textArea.clientWidth);
    }

    onMouseDown(event: MouseEvent): void {
        const textAreaSelector = document.querySelector('#textArea');
        // @ts-ignore
        if (textAreaSelector !== null && textAreaSelector.contains(event.target)) return;
        this.drawStyledText();
        this.text = '';
        this.numberOfRows = 1;
        this.showTextBox = !this.showTextBox;
        this.textBoxPosition = this.getPositionFromMouse(event);
    }

    drawStyledText(): void {
        const textFinalPosition = this.getTextFinalPosition(this.textBoxPosition);
        this.fillTextMultiLine(this.drawingService.baseCtx, this.text, textFinalPosition);
    }

    getTextFinalPosition(currentPosition: Vec2): Vec2 {
        const textPosition = { ...currentPosition };
        let textAreaWidth = 0;
        const textArea = document.getElementById('textArea') as HTMLTextAreaElement;
        if (textArea !== null) textAreaWidth = textArea.clientWidth;
        switch (this.textAlign) {
            case TextAlign.Start:
                break;

            case TextAlign.Center:
                textPosition.x += (this.textBoxSize.x + textAreaWidth) / 2;
                break;

            case TextAlign.End:
                textPosition.x += this.textBoxSize.x + textAreaWidth;
                break;
        }
        return textPosition;
    }

    fillTextMultiLine(context: CanvasRenderingContext2D, text: string, position: Vec2): void {
        const fontHeight = this.calculateFontHeight(context, text);
        context.fillStyle = this.currentColorService.getPrimaryColorRgb();
        context.font = ` ${this.getCurrentStyle()} ${this.fontSize}px ${this.fontFace}`;
        context.textAlign = this.textAlign;
        position.y += fontHeight;

        const lines = text.split('\n');
        lines.forEach((line: string) => {
            context.fillText(line, position.x, position.y);
            position.y += fontHeight + FONT_HEIGHT_FACTOR * fontHeight;
        });
    }

    calculateFontHeight(context: CanvasRenderingContext2D, text: string): number {
        const metrics = context.measureText(text);
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }

    calculateNumberOfLines(): number {
        return this.text.split('\n').length;
    }

    calculateNumberOfCols(): number {
        const maxLineLength = this.calculateMaxLineLength();
        // const maxLineLength = this.drawingService.baseCtx.measureText(this.text).width;
        // console.log('maxLength :' + maxLineLength);
        const lines = this.text.split('\n');
        const currentLine = lines[lines.length - 1];
        // @ts-ignore
        let previousLine = currentLine;
        if (lines.length > 1) {
            previousLine = lines[lines.length - 2];
        }
        // let numberOfCols = currentLine.length;
        let numberOfCols = maxLineLength;

        if (currentLine.length > maxLineLength) {
            numberOfCols = currentLine.length;
        }
        // console.log('number of cols : ' + numberOfCols);
        // console.log(currentLine);
        return numberOfCols;
    }

    private calculateMaxLineLength(): number {
        const lines = this.text.split('\n');
        let maxLineLength = lines[0].length;
        for (const line of lines) {
            if (line.length > maxLineLength) {
                maxLineLength = line.length;
            }
        }
        return maxLineLength;
    }

    getCurrentStyle(): string {
        const bold = this.getSingleStyle('bold');
        const italic = this.getSingleStyle('italic');

        return bold.concat(' ').concat(italic);
    }

    getSingleStyle(style: string): string {
        let textStyle = '';
        for (const item of this.textStyles) {
            if (style === item) {
                textStyle = item;
            }
        }
        return textStyle;
    }

    // tslint:disable-next-line:no-empty
    executeCommand(command: ToolCommand): void {}
}
