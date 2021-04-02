import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCreatorService } from '@app/services/line-creator/line-creator.service';
import { DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS, MIN_ARRAY_LENGTH } from '@app/services/tools/tools-constants';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
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
            if (this.pathData.length > MIN_ARRAY_LENGTH) {
                if (this.verifyLastPoint(this.pathData[0])) this.endOfSelection();
            }
        }
        this.mouseDown = false;
    }

    verifyValideLine(): boolean {
        // const pathLength = this.pathData.length - 1;
        // const lineToVerify: Vec2[] = [this.pathData[pathLength], this.pathData[pathLength - 1]];
        // for (let i = 0; i < pathLength - 1; i++) {
        //     const drawnLine: Vec2[] = [this.pathData[i], this.pathData[i + 1]];
        //     if (this.verifiyCrossedLines(drawnLine, lineToVerify)) {
        //         return false;
        //     }
        // }
        return true;
    }

    private valideLine(): boolean {
        return this.verifyValideLine() && this.pathData.length >= MIN_ARRAY_LENGTH;
    }

    getPrimaryColor(): string {
        return this.valideLine() ? '#000000' : '#ff0000';
    }

    private endOfSelection(): void {
        const closedSegment = true;
        this.started = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.pop();
        this.drawLine(
            this.drawingService.baseCtx,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            closedSegment,
        );
        this.clearPath();
    }

    // (Fx - Ex)(Py - Fy) - (Fy - Ey)(Px - Fx)

    // (Fx - Ex)(Qy - Fy) - (Fy - Ey)(Qx - Fx)
    // Cross product between 2 lines
    verifiyCrossedLines(line1: Vec2[], line2: Vec2[]): boolean {
        const crossProd1 = (line1[1].x - line1[0].x) * (line2[0].y - line1[1].y) - (line1[1].y - line1[0].y) * (line2[0].x - line1[1].x);
        const crossProd2 = (line1[1].x - line1[0].x) * (line2[1].y - line1[1].y) - (line1[1].y - line1[0].y) * (line2[1].x - line1[1].x);

        return crossProd1 * crossProd2 <= 0;
    }

    executeCommand(command: ToolCommand): void {
        return;
    }
}
