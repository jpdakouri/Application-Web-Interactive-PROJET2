import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { PREVIEW_NUMBER_OF_SQUARES_PER_SIDE } from '@app/components/components-constants';
import { PipetteService } from '@app/services/tools/pipette-service/pipette.service';
import { OUT_OF_BOUND_COLOR_RGBA, PREVIEW_HALF_SIZE } from '@app/services/tools/tools-constants';

@Component({
    selector: 'app-pipette-preview',
    templateUrl: './pipette-preview.component.html',
    styleUrls: ['./pipette-preview.component.scss'],
})
export class PipettePreviewComponent {
    @ViewChild('pipettePreviewCanvas', { static: false }) pipettePreviewCanvas: ElementRef<HTMLCanvasElement>;
    constructor(public pipette: PipetteService) {}

    @HostListener('window:mousemove', [])
    onMouseMove(): void {
        if (this.pipette.getIsCursorOnCanvas()) this.drawPreview();
    }

    private drawPreview(): void {
        if (this.pipettePreviewCanvas != undefined) {
            const ctx = this.pipettePreviewCanvas.nativeElement.getContext('2d');
            if (ctx != null) {
                const previewColors = this.pipette.getPreviewColors();
                for (let i = 0; i < PREVIEW_NUMBER_OF_SQUARES_PER_SIDE; i++) {
                    for (let j = 0; j < PREVIEW_NUMBER_OF_SQUARES_PER_SIDE; j++) {
                        this.drawSquare(ctx, i, j, previewColors[j][i]);
                    }
                }
            }
        }
    }

    private drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
        const pixelsOnPreviewPerPixel = this.pipettePreviewCanvas.nativeElement.width / PREVIEW_NUMBER_OF_SQUARES_PER_SIDE;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = OUT_OF_BOUND_COLOR_RGBA;
        ctx.lineWidth = 1;
        const initialPosition: Vec2 = { x: x * pixelsOnPreviewPerPixel, y: y * pixelsOnPreviewPerPixel };
        const finalPosition: Vec2 = { x: (x + 1) * pixelsOnPreviewPerPixel, y: (y + 1) * pixelsOnPreviewPerPixel };
        ctx.fillRect(initialPosition.x, initialPosition.y, finalPosition.x, finalPosition.y);
        if (x === PREVIEW_HALF_SIZE && y === PREVIEW_HALF_SIZE) {
            ctx.strokeRect(initialPosition.x, initialPosition.y, pixelsOnPreviewPerPixel, pixelsOnPreviewPerPixel);
        }
    }
}
