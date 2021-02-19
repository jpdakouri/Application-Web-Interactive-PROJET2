import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButtons } from '@app/utils/enums/list-boutton-pressed';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        const rgbAtPosition = this.getRgbAtPosition(event.offsetX, event.offsetY);
        this.currentColourService.setPrimaryColorRgb(rgbAtPosition);
    }

    private getRgbAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2];
    }
}
