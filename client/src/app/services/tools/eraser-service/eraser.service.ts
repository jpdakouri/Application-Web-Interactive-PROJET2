import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from '@app/utils/enums/list-boutton-pressed';
import { MIN_ERASER_THICKNESS } from '../tools-constants';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineThickness = MIN_ERASER_THICKNESS;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            // tslint:disable-next-line:no-magic-numbers
            this.drawingService.baseCtx.clearRect(mousePos.x, mousePos.y, 30, 30);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }
}
