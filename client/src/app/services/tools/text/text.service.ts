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
    private mouseDownCoordinate: Vec2;
    private text: string;
    private currentTextPosition: Vec2;
    textAlign: TextAlign = TextAlign.Start;

    constructor(currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        // this.fonts = Object.values(TextFont);
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.text = '|';
        this.mouseDownCoordinate = { x: 0, y: 0 };
        this.currentTextPosition = { x: 0, y: 0 };
        this.textAlign = TextAlign.Start;
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        this.mouseDownCoordinate = this.getPositionFromMouse(event);
        // this.draw();
        // this.drawingService.clearCanvas(this.drawingService.baseCtx);

        // const position = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;
        this.drawStyledText(this.drawingService.baseCtx, this.text, this.currentTextPosition, TextFont.BrushScriptMT, this.fontSize as number);

        this.text = '|'; // TODO: IMPORTANT for the cursor
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // this.drawingService.previewCtx.fillRect(this.mouseDownCoordinate.x, this.mouseDownCoordinate.y, 2, this.fontSize as number);
        console.log(this.fontSize);

        console.log(this.textAlign);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    onKeyDown(event: KeyboardEvent): void {
        this.currentTextPosition = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;

        // TODO: create a map of these keys
        switch (event.key) {
            case 'Enter':
                this.handleEnterKey();
                break;

            case 'Delete':
                this.handleDeleteKey();
                break;

            case 'Backspace':
                this.handleBackspaceKey();
                break;

            case 'ArrowLeft':
                this.handleArrowLeftKey();
                break;

            case 'ArrowRight':
                this.handleArrowRightKey();
                break;
        }

        if (
            !event.shiftKey &&
            !event.ctrlKey &&
            !event.altKey &&
            event.key !== 'Backspace' &&
            event.key !== 'ArrowLeft' &&
            event.key !== 'ArrowRight' &&
            event.key !== 'Enter' &&
            event.key !== 'Delete'
        ) {
            // this.text = this.text.concat(event.key);
            // const cursorIndex = this.text.indexOf('|');
            console.log(this.cursorIndex);
            this.text = this.text.slice(0, this.cursorIndex) + event.key + this.text.slice(this.cursorIndex, this.text.length);
        }
        // if (event.shiftKey || event.ctrlKey || event.altKey) {
        //     this.text = this.text.concat(event.key.slice(0, 8));
        //     // this.text = this.text.concat(event.key);
        // }

        // this.text = this.text.concat(event.key);

        // console.log(this.text);

        // const position = { x: this.drawingService.canvas.width / 2, y: this.drawingService.canvas.width / 4 } as Vec2;
        const position = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;
        // const position = this.currentTextPosition;
        this.drawStyledText(this.drawingService.previewCtx, this.text, position, TextFont.BrushScriptMT, this.fontSize as number);
    }

    private handleArrowRightKey(): void {
        // const array = this.text.split('|');
        // const temp = this.text.slice(0, this.text.indexOf('|')) + '|';
        // const cursorIndex = this.text.indexOf('|');
        console.log(this.cursorIndex);
        if (this.cursorIndex < this.text.length - 1) {
            this.text =
                this.text.slice(0, this.cursorIndex) +
                this.text.charAt(this.cursorIndex + 1) +
                '|' +
                this.text.slice(this.cursorIndex + 2, this.text.length);
        }
        console.log(this.text);
    }

    private handleArrowLeftKey(): void {
        console.log('ArrowLeft');

        // const array = this.text.split('|');
        // const temp = this.text.slice(0, this.text.indexOf('|')) + '|';
        console.log(this.cursorIndex);
        if (this.cursorIndex > 0) {
            this.text =
                this.text.slice(0, this.cursorIndex - 1) +
                '|' +
                this.text.charAt(this.cursorIndex - 1) +
                this.text.slice(this.cursorIndex + 1, this.text.length);
        }
        console.log(this.text);
    }

    private handleBackspaceKey(): void {
        // this.text = this.text.slice(0, this.text.length); // V1
        if (this.cursorIndex > 0) {
            this.text = this.text.slice(0, this.cursorIndex - 1) + this.text.slice(this.cursorIndex, this.text.length);
        }
    }

    private handleEnterKey(): void {
        // this.currentTextPosition.x = this.currentTextPosition.x - this.drawingService.baseCtx.measureText(this.text).width;
        const t = this.fontSize as number;
        this.currentTextPosition.y = this.currentTextPosition.y + t;
        console.log(this.currentTextPosition.x);
    }

    private handleDeleteKey(): void {
        console.log(this.cursorIndex);
        if (this.cursorIndex !== this.text.length - 1) {
            this.text =
                this.text.slice(0, this.cursorIndex + 1) +
                // '|' +
                // this.text.charAt(cursorIndex + 1) +
                this.text.slice(this.cursorIndex + 2, this.text.length);
        }
        console.log(this.text);
    }

    get cursorIndex(): number {
        const cursor = '|';
        return this.text.indexOf(cursor);
    }
    draw(): void {
        this.drawStyledText(this.drawingService.previewCtx, this.text, this.currentTextPosition, TextFont.BrushScriptMT, this.fontSize as number);
        console.log(this.textAlign);
        // this.drawingService.clearCanvas(this.drawingService.baseCtx);
        // this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // // clear background
        // this.drawingService.baseCtx.fillStyle = this.currentColorService.getPrimaryColorRgb();
        // // draw fontFace in red
        // // this.drawingService.baseCtx.fillStyle = '#cb2f2f';
        // this.drawingService.baseCtx.strokeStyle = '#cb2f2f';
        // // ctx.fontFace=fontSize+" "+fontFace; // ! important
        // this.drawingService.baseCtx.font = `bold italic ${this.fontSize}px ${this.fontFace}`;
        // this.drawingService.baseCtx.textAlign = TextAlign.Center;
        // // context.fillText('Canvas Rocks!', 50, 100);
        // // context.strokeText('Canvas Rocks!', 50, 230);
        // this.drawingService.baseCtx.fillText('LOG2990 :)', this.drawingService.canvas.width / 2, this.drawingService.canvas.height / 4);
        // this.drawingService.baseCtx.strokeText('Projet 2 !', this.drawingService.canvas.width / 2, this.drawingService.canvas.height / 2);
    } // end draw

    drawStyledText(
        context: CanvasRenderingContext2D,
        text: string,
        position: Vec2,
        fontFace: TextFont,
        fontSize: number,
        textStyle?: string,
        textAlign?: string,
    ): void {
        // context.fillRect(context.measureText(text).width, position.y, 2, this.fontSize as number);

        // const tempFontSize = this.fontSize as number;
        // tslint:disable-next-line:no-magic-numbers
        // this.drawingService.baseCtx.fillRect(this.mouseDownCoordinate.x, this.mouseDownCoordinate.y, 1, -(3 / 2) * tempFontSize);

        // this.drawingService.clearCanvas(this.drawingService.baseCtx);
        // text = text.concat('|'); // TODO: IMPORTANT for the cursor
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.drawingService.previewCtx.fillStyle = this.currentColorService.getPrimaryColorRgb();
        this.drawingService.baseCtx.fillStyle = this.currentColorService.getPrimaryColorRgb();

        context.font = `${this.fontSize}px ${this.fontFace}`;
        context.textAlign = this.textAlign;
        context.fillText(text, position.x, position.y);
    }

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    executeCommand(command: ToolCommand): void {}
}
