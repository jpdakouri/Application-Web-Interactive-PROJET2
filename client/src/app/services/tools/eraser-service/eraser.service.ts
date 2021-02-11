import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/list-boutton-pressed';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
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
