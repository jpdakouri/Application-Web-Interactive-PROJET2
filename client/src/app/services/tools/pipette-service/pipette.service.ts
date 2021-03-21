import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_INDEX, DEFAULT_CANVAS_RGB, DEFAULT_CANVAS_RGBA } from '@app/services/services-constants';
import { OUT_OF_BOUND_COLOR_RGBA, PREVIEW_SIZE } from '@app/services/tools/tools-constants';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { RgbSettings } from '@app/utils/enums/rgb-settings';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    private previewColors: string[][];
    private isCursorOnCanvas: boolean;
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.isCursorOnCanvas = false;
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
                    if (this.getAlphaAtPosition(j, i) !== '0') currentRow.push(this.getRgbaAtPosition(j, i));
                    else currentRow.push(DEFAULT_CANVAS_RGBA);
                } else currentRow.push(OUT_OF_BOUND_COLOR_RGBA);
            }
            this.previewColors.push(currentRow);
        }
    }

    onMouseEnter(): void {
        this.isCursorOnCanvas = true;
    }

    onMouseLeave(): void {
        this.isCursorOnCanvas = false;
    }

    getIsCursorOnCanvas(): boolean {
        return this.isCursorOnCanvas;
    }

    getPreviewColors(): string[][] {
        return this.previewColors;
    }

    private getRgbAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2];
    }

    private getRgbaAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        return (
            RgbSettings.RGBA_START +
            imageData[0] +
            RgbSettings.RGB_RGBA_SEPARATOR +
            imageData[1] +
            RgbSettings.RGB_RGBA_SEPARATOR +
            imageData[2] +
            RgbSettings.RGB_RGBA_SEPARATOR +
            imageData[ALPHA_INDEX] +
            RgbSettings.RGB_RGBA_END
        );
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
