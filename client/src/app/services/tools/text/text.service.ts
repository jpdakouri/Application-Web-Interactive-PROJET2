import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_FONT_SIZE } from '@app/services/tools/tools-constants';
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
    textBoxPosition: Vec2;
    textHasBeenCreated: boolean;
    textStyles: string[];
    fontStyle: string;
    isWriting: boolean;
    showTextBox: boolean;
    textBoxSize: Vec2;

    constructor(public currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.text = '';
        this.textAlign = TextAlign.Start;
        this.textStyles = [];
        this.fontStyle = '';
        this.textBoxPosition = { x: 0, y: 0 };
        this.textBoxSize = { x: 800, y: 200 };
        this.isWriting = false;
        this.textHasBeenCreated = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.showTextBox = true;

        const textAreaSelector = document.querySelector('#textArea');
        // @ts-ignore
        if (textAreaSelector !== null && textAreaSelector.contains(event.target)) {
            console.log('in');
        } else {
            console.log('out');
            this.testText();
            this.text = '';
            this.isWriting = !this.isWriting;
            this.textBoxPosition = this.getPositionFromMouse(event);
        }
    }

    drawStyledText(
        context: CanvasRenderingContext2D,
        text: string,
        position: Vec2,
        fontFace: TextFont,
        fontSize: number,
        textStyle?: string,
        textAlign?: string,
    ): void {}

    testText(): void {
        console.log(this.textBoxSize.x);
        this.fillTextMultiLine(this.drawingService.baseCtx, this.text, this.getTextFinalPosition(this.textBoxPosition));
    }

    fillTextMultiLine(context: CanvasRenderingContext2D, text: string, position: Vec2): void {
        context.font = ` ${this.getCurrentStyle()} ${this.fontSize}px ${this.fontFace}`;
        context.textAlign = this.textAlign;
        console.log(context.textAlign);
        context.fillStyle = this.currentColorService.getPrimaryColorRgb();

        const fontHeight = this.calculateFontHeight(context, text);
        const lines = text.split('\n');
        position.y += fontHeight;

        lines.forEach((line) => {
            context.fillText(line, position.x, position.y);
            position.y += fontHeight + 0.025 * fontHeight;
        });
    }

    calculateFontHeight(context: CanvasRenderingContext2D, text: string): number {
        const metrics = context.measureText(text);
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }

    getTextFinalPosition(currentPosition: Vec2): Vec2 {
        const textPosition = { ...currentPosition };
        switch (this.textAlign) {
            case TextAlign.Start:
                break;

            case TextAlign.Center:
                textPosition.x += this.textBoxSize.x / 2;
                break;

            case TextAlign.End:
                textPosition.x += this.textBoxSize.x;
                break;
        }
        return textPosition;
    }

    getCurrentStyle(): string {
        const bold = this.getSingleStyle('bold');
        const italic = this.getSingleStyle('italic');

        return bold.concat(' ').concat(italic);
    }

    getSingleStyle(style: string): string {
        let textStyle = '';
        console.log(this.textStyles);
        for (const item of this.textStyles) {
            if (style === item) {
                textStyle = item;
            }
        }
        return textStyle;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButtons.Escape) {
            if (this.isWriting) {
                this.isWriting = false;
            }
            this.text = '';
        }
    }

    executeCommand(command: ToolCommand): void {}
}
