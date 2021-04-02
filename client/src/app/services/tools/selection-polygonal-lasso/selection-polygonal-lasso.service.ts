import { Injectable } from '@angular/core';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCreatorService } from '@app/services/line-creator/line-creator.service';
import { DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS } from '../tools-constants';

@Injectable({
    providedIn: 'root',
})
export class SelectionPolygonalLassoService extends LineCreatorService {
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.defaultMouseUp(event);
            console.log(this.pathData);
            if (this.pathData.length > 2 && this.verifyLastPoint(this.pathData[0])) {
                this.endOfSelection();
            }
        }
        this.mouseDown = false;
    }

    private endOfSelection(): void {
        let closedSegment = false;
        this.started = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.pop();
        closedSegment = true;
        this.drawLine(
            this.drawingService.baseCtx,
            this.currentColorService.getPrimaryColorHex(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            closedSegment,
        );
        this.clearPath();
    }
}
