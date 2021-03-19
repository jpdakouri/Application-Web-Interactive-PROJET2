import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_INDEX, DEFAULT_CANVAS_RGB } from '@app/services/services-constants';
import { OUT_OF_BOUND_COLOR, PREVIEW_SIZE } from '@app/services/tools/tools-constants';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    private previewColors: string[][];
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

    onMouseMove(event: MouseEvent): void {
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;
        this.previewColors = [];
        for (let i = -PREVIEW_SIZE / 2; i < PREVIEW_SIZE / 2 + 1; i++) {
            const currentRow: string[] = [];
            for (let j = -PREVIEW_SIZE / 2; j < PREVIEW_SIZE / 2 + 1; j++) {
                if (0 <= i && 0 <= j && canvasHeight > i && canvasWidth > j) {
                    if (this.getAlphaAtPosition(j, i) !== '0') currentRow.push(this.getAlphaAtPosition(j, i));
                    else currentRow.push(DEFAULT_CANVAS_RGB);
                } else currentRow.push(OUT_OF_BOUND_COLOR);
            }
            this.previewColors.push(currentRow);
        }
    }

    getPreviewColors(): string[][] {
        return this.previewColors;
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

    executeCommand(command: ToolCommand): void {
        // Pipette has no command to undo/redo
        return;
    }
}
