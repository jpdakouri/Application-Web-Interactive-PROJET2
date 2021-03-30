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
    // private currentFontSize: number;

    // private currentAlign: TextAlign;
    private mouseDownCoordinate: Vec2;
    private text: string;
    private currentTextPosition: Vec2;

    constructor(currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        // this.fonts = Object.values(TextFont);
        this.fontFace = TextFont.Arial;
        this.fontSize = DEFAULT_FONT_SIZE;
        this.text = '';
        this.mouseDownCoordinate = { x: 0, y: 0 };
        this.currentTextPosition = { x: 0, y: 0 };

        // this.currentAlign = TextAlign.Start;
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        this.mouseDownCoordinate = this.getPositionFromMouse(event);
        // this.draw();
        // this.drawingService.clearCanvas(this.drawingService.baseCtx);

        // const position = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;
        this.drawStyledText(this.drawingService.baseCtx, this.text, this.currentTextPosition, TextFont.BrushScriptMT, this.fontSize as number);

        this.text = '';
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        console.log(this.fontSize);
    }

    onMouseUp(event: MouseEvent): void {
        super.onMouseUp(event);
    }

    onMouseMove(event: MouseEvent): void {
        super.onMouseMove(event);
    }

    onMouseEnter(event: MouseEvent): void {
        super.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        super.onMouseLeave(event);
        // this.text = '';
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Backspace' && this.text.length !== 0) {
            this.text = this.text.slice(0, this.text.length - 1);
        }

        // super.onKeyDown(event);
        if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.key !== 'Backspace') {
            // this.text = this.text.concat(event.key.slice(0, 8));
            this.text = this.text.concat(event.key);
        }
        // if (event.shiftKey || event.ctrlKey || event.altKey) {
        //     this.text = this.text.concat(event.key.slice(0, 8));
        //     // this.text = this.text.concat(event.key);
        // }

        // this.text = this.text.concat(event.key);

        console.log(this.text);

        // const position = { x: this.drawingService.canvas.width / 2, y: this.drawingService.canvas.width / 4 } as Vec2;
        const position = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;
        this.currentTextPosition = { x: this.mouseDownCoordinate.x, y: this.mouseDownCoordinate.y } as Vec2;
        this.drawStyledText(this.drawingService.previewCtx, this.text, position, TextFont.BrushScriptMT, this.fontSize as number);
    }

    onKeyUp(event: KeyboardEvent): void {
        super.onKeyUp(event);
    }

    draw(): void {
        this.drawStyledText(this.drawingService.previewCtx, this.text, this.currentTextPosition, TextFont.BrushScriptMT, this.fontSize as number);

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

        // this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        text = text.concat('|');

        context.font = `${this.fontSize}px ${this.fontFace}`;

        context.textAlign = TextAlign.Center;

        context.fillText(text, position.x, position.y);
    }

    executeCommand(command: ToolCommand): void {}
}
