import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    // private fonts: string[];
    // @ts-ignore
    private currentFont: string;
    // @ts-ignore
    private currentFontSize: number;

    constructor(currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
        // this.fonts = Object.values(TextFont);
        this.currentFont = TextFont.Arial;
        this.currentFontSize = 2;
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        this.draw();
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
    }

    onKeyDown(event: KeyboardEvent): void {
        super.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        super.onKeyUp(event);
    }

    draw(): void {
        const context = this.drawingService.baseCtx;
        //clear background
        context.fillStyle = 'white';
        // draw font in red
        context.fillStyle = 'red';
        context.font = '50pt Monaco';
        context.fillText('Canvas Rocks!', 50, 100);
        context.strokeText('Canvas Rocks!', 50, 230);
    } // end draw

    executeCommand(command: ToolCommand): void {}
}
