import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    constructor(currentColorService: CurrentColorService, drawingService: DrawingService) {
        super(drawingService, currentColorService);
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
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

    executeCommand(command: ToolCommand): void {}
}
