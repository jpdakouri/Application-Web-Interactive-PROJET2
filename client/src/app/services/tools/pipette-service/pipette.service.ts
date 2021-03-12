import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_INDEX, DEFAULT_CANVAS_RGB } from '@app/services/services-constants';
import { MouseButtons } from '@app/utils/enums/list-boutton-pressed';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        let rgbAtPosition = this.getRgbAtPosition(event.offsetX, event.offsetY);
        if (this.getAlphaAtPosition(event.offsetX, event.offsetY) === '0') rgbAtPosition = DEFAULT_CANVAS_RGB;
        if (event.button === MouseButtons.Left) this.currentColourService.setPrimaryColorRgb(rgbAtPosition);
        else this.currentColourService.setSecondaryColorRgb(rgbAtPosition);
    }

    private getRgbAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2];
    }
    private getAlphaAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        return imageData[ALPHA_INDEX].toString();
    }
}
