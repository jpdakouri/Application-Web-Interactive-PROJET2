import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_FONT_SIZE } from '@app/services/tools/tools-constants';
import { TextAlign } from '@app/utils/enums/text-align.enum';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    // private fonts: string[];
    // currentFont: string;
    textArea: HTMLTextAreaElement;
    // private mouseDownCoordinate: Vec2;
    text: string;
    // private currentTextPosition: Vec2;
    textAlign: TextAlign = TextAlign.Start;
    textBoxPosition: Vec2;
    textHasBeenCreated: boolean;

    textStyle: string;
    fontStyle: string;
    fontWeight: string;
    isWriting: boolean;
    textBoxSize: Vec2;

    constructor(public currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.text = '';
        // this.mouseDownCoordinate = { x: 0, y: 0 };
        // this.currentTextPosition = { x: 0, y: 0 };
        this.textAlign = TextAlign.Start;
        this.textStyle = '';
        this.fontStyle = '';
        this.fontWeight = '';
        this.textBoxPosition = { x: 0, y: 0 };
        this.textBoxSize = { x: 300, y: 100 };
        this.isWriting = false;
        this.textHasBeenCreated = false;
    }

    onMouseDown(event: MouseEvent): void {
        // this.text = this.textArea.value;
        console.log(this.textArea.value);

        const myElementToCheckIfClicksAreInsideOf = document.querySelector('#textArea');
        // @ts-ignore
        if (myElementToCheckIfClicksAreInsideOf !== null && myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
            // if (!this.isWriting) {
            //     this.isWriting = true;
            // } else {
            //     this.testText();
            //     this.textBoxPosition = this.getPositionFromMouse(event);
            // }
            console.log('in');
        } else {
            console.log('out');
            // this.text = this.textArea.value;
            this.testText();
            this.text = '';
            this.isWriting = !this.isWriting;
            this.textBoxPosition = this.getPositionFromMouse(event);
        }
        // this.mouseDownCoordinate = this.getPositionFromMouse(event);

        // this.isWriting = true;
        // this.mouseDownCoordinate = this.getPositionFromMouse(event);
        // if (!this.isClickInTextBox(event)) {
        //     this.textBoxPosition = this.getPositionFromMouse(event);
        // }
        // this.isWriting = false;
        // // this.textBoxPosition = { x: event.offsetX, y: event.offsetY };
        // console.log('textBoxPosition ' + this.textBoxPosition.x);
        //
        // this.testText();
    }

    testText(): void {
        // this.text = this.textArea.value;
        console.log(this.text);
        // this.fillTextMultiLine(this.drawingService.baseCtx, this.text, this.mouseDownCoordinate.x, this.mouseDownCoordinate.y);
        // this.fillTextMultiLine(this.drawingService.baseCtx, this.text, this.textBoxPosition.x, this.textBoxPosition.y);

        console.log(' pos x ' + this.textBoxPosition.x);
        console.log('final pos x ' + this.getTextFinalPosition(this.textBoxPosition).x);
        this.fillTextMultiLine(this.drawingService.baseCtx, this.text, this.getTextFinalPosition(this.textBoxPosition));
        // this.text = '';
        // this.textArea.value = '';
    }

    fillTextMultiLine(ctx: CanvasRenderingContext2D, text: string, position: Vec2): void {
        // this.drawingService.clearCanvas(ctx); // TODO : temp --- to remove
        const bold = this.getSingleStyle('bold') == undefined ? '' : 'bold';
        const italic = this.getSingleStyle('italic') == undefined ? '' : 'italic';
        this.fontWeight = bold.concat(' ').concat(italic);
        ctx.font = ` ${this.fontWeight} ${this.fontSize}px ${this.fontFace}`;
        ctx.textAlign = this.textAlign;
        console.log(ctx.textAlign);
        ctx.fillStyle = this.currentColorService.getPrimaryColorRgb();

        // this.drawingService.clearCanvas(ctx);
        const metrics = ctx.measureText(text);
        const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        // const lineHeight = ctx.measureText('M').width * 1.286; // a good approx for 10-18px sizes;
        const lines = text.split('\n');
        position.y += fontHeight;

        for (let i = 0; i < lines.length; ++i) {
            ctx.fillText(lines[i], position.x, position.y);
            position.y += fontHeight + 0.025 * fontHeight;
        }
    }

    isClickInTextBox(event: MouseEvent): boolean {
        // console.log('mousePosition ' + event.clientX);

        console.log('isClick in ' + this.textBoxPosition.x);
        return (
            !(event.offsetX < this.textBoxSize.x || event.offsetX > this.textBoxSize.x + this.textBoxPosition.x) &&
            !(event.offsetY < this.textBoxSize.y || event.offsetY < this.textBoxSize.y + this.textBoxPosition.y)
        );
    }

    draw(): void {}

    drawStyledText(
        context: CanvasRenderingContext2D,
        text: string,
        position: Vec2,
        fontFace: TextFont,
        fontSize: number,
        textStyle?: string,
        textAlign?: string,
    ): void {
        // this.drawingService.clearCanvas(this.drawingService.previewCtx);
        //
        // this.drawingService.previewCtx.fillStyle = this.currentColorService.getPrimaryColorRgb();
        // this.drawingService.baseCtx.fillStyle = this.currentColorService.getPrimaryColorRgb();
        //
        // context.font = `${this.fontSize}px ${this.fontFace}`;
        // // @ts-ignore
        // context.textAlign = this.textAlign as string;
        // context.fillText(text, position.x, position.y);
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

    getStyle(): string {
        // console.log(this.textStyle);
        // const temp = this.textStyle.split(',');
        let tempStyle = '';
        for (const item of this.textStyle) {
            tempStyle = tempStyle.concat(' ').concat(item);
        }
        // console.log(tempStyle);
        return tempStyle;
    }

    // @ts-ignore
    getSingleStyle(style: string): string {
        for (let i = 0; i < this.textStyle.length; i++) {
            if (this.textStyle[i] === style) {
                // console.log(this.textStyle[i]);
                return this.textStyle[i];
            }
        }
    }

    getTextDecoration(): string {
        let tempStyle = '';
        if (this.getSingleStyle('underline') !== undefined) tempStyle += this.getSingleStyle('underline') + ' ';
        if (this.getSingleStyle('line-through') !== undefined) tempStyle += this.getSingleStyle('line-through');
        // console.log(tempStyle);
        return tempStyle;
    }

    executeCommand(command: ToolCommand): void {}
}
