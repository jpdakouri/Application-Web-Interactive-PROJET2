import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_FONT_SIZE, FONT_HEIGHT_FACTOR, NEW_LINE_SEPARATOR } from '@app/services/tools/tools-constants';
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
    numberOfRows: number;
    showTextBox: boolean;
    textBoxPosition: Vec2;
    textBoxSize: Vec2;

    constructor(public currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        this.text = '';
        this.textAlign = TextAlign.Start;
        this.textStyles = [];
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.fontStyle = '';
        this.showTextBox = false;
        this.numberOfRows = 1;
        this.textBoxSize = { x: 0, y: 0 };
        this.textBoxPosition = { x: 0, y: 0 };
    }

    onKeyDown(event: KeyboardEvent): void {
        console.log(this.text);
        if (event.key === KeyboardButtons.Escape && this.showTextBox) {
            this.showTextBox = false;
            this.text = '';
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.numberOfRows = this.calculateNumberOfLines(this.text);
    }

    onMouseDown(event: MouseEvent): void {
        const textAreaSelector = document.getElementById('textArea');
        // @ts-ignore
        if (textAreaSelector !== null && textAreaSelector.contains(event.target)) return;

        this.drawStyledTextOnCanvas();
        this.text = '';
        this.numberOfRows = 1;
        this.showTextBox = !this.showTextBox;
        this.textBoxPosition = this.getPositionFromMouse(event);
    }

    drawStyledTextOnCanvas(): void {
        if (this.text === '') return;
        const textFinalPosition = this.calculateTextFinalPosition(this.textBoxPosition);
        this.fillTextMultiLine(this.drawingService.baseCtx, this.text, textFinalPosition);
    }

    private calculateTextFinalPosition(currentPosition: Vec2): Vec2 {
        const textPosition = { ...currentPosition };
        let textAreaWidth = 0;
        const textArea = document.getElementById('textArea') as HTMLTextAreaElement;
        if (textArea) textAreaWidth = textArea.clientWidth;
        switch (this.textAlign) {
            case TextAlign.Start:
                break;

            case TextAlign.Center:
                textPosition.x += textAreaWidth / 2;
                console.log(this.textBoxSize.x);
                break;

            case TextAlign.End:
                textPosition.x += textAreaWidth;
                break;
        }
        return textPosition;
    }

    fillTextMultiLine(context: CanvasRenderingContext2D, text: string, position: Vec2): void {
        const fontHeight = this.calculateFontHeight(context, text);
        const textPosition = { ...position };
        context.fillStyle = this.currentColorService.getPrimaryColorRgb();
        context.font = ` ${this.getCurrentStyle()} ${this.fontSize}px ${this.fontFace}`;
        context.textAlign = this.textAlign;
        textPosition.y += fontHeight;

        const lines = this.splitTextInToLines(text);
        lines.forEach((line: string) => {
            context.fillText(line, textPosition.x, textPosition.y);
            textPosition.y += fontHeight + FONT_HEIGHT_FACTOR * fontHeight;
        });
    }

    private calculateFontHeight(context: CanvasRenderingContext2D, text: string): number {
        const metrics = context.measureText(text);
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }

    private calculateNumberOfLines(text: string): number {
        return this.splitTextInToLines(text).length;
    }

    private splitTextInToLines(text: string): string[] {
        return text.split(NEW_LINE_SEPARATOR);
    }

    calculateNumberOfCols(): number {
        const maxLineLength = this.calculateMaxLineLength(this.text);
        const lines = this.splitTextInToLines(this.text);
        const currentLine = lines[lines.length - 1];
        let numberOfCols = maxLineLength;

        if (currentLine.length > maxLineLength) {
            numberOfCols = currentLine.length;
        }
        return numberOfCols + 0.15 * numberOfCols;
    }

    private calculateMaxLineLength(text: string): number {
        const lines = this.splitTextInToLines(text);
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
