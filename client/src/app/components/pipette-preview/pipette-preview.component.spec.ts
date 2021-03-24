import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from '@app/services/tools/pipette-service/pipette.service';
import { PREVIEW_SIZE } from '@app/services/tools/tools-constants';

import { PipettePreviewComponent } from './pipette-preview.component';

describe('PipettePreviewComponent', () => {
    let component: PipettePreviewComponent;
    let fixture: ComponentFixture<PipettePreviewComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let drawingService: DrawingService;
    let baseCanvasContext: CanvasRenderingContext2D;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PipettePreviewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PipettePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingService = TestBed.inject(DrawingService);

        baseCanvasContext = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.baseCtx = baseCanvasContext;
        drawingService.canvas = canvasTestHelper.canvas;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onMouseMove doesnt draw the preview if the cursor is not on the canvas', () => {
        const service = TestBed.inject(PipetteService);
        spyOn(service, 'getIsCursorOnCanvas').and.returnValue(false);
        const ctx = TestBed.inject(DrawingService).baseCtx;
        spyOn(ctx, 'fillRect');
        component.onMouseMove();
        expect(ctx.fillRect).not.toHaveBeenCalled();
    });

    it('onMouseMove gets the preview colors, colors the canvas 225 times for each pixel and draws a square around the central pixel', () => {
        const service = TestBed.inject(PipetteService);
        spyOn(service, 'getIsCursorOnCanvas').and.returnValue(true);
        const previewColors: string[][] = [];
        for (let i = 0; i < PREVIEW_SIZE; i++) {
            const currentRow: string[] = [];
            for (let j = 0; j < PREVIEW_SIZE; j++) {
                currentRow.push('255,255,255,1');
            }
            previewColors.push(currentRow);
        }
        spyOn(service, 'getPreviewColors').and.returnValue(previewColors);
        spyOn(drawingService.baseCtx, 'fillRect');
        spyOn(drawingService.baseCtx, 'strokeRect');
        const expectedCallTimes = PREVIEW_SIZE * PREVIEW_SIZE;
        component.pipettePreviewCanvas = new ElementRef<HTMLCanvasElement>(canvasTestHelper.canvas);
        component.onMouseMove();
        expect(service.getPreviewColors).toHaveBeenCalled();
        expect(drawingService.baseCtx.fillRect).toHaveBeenCalledTimes(expectedCallTimes);
        expect(drawingService.baseCtx.strokeRect).toHaveBeenCalledTimes(1);
    });

    it('onMouseMove doesnt draw the preview if the canvas or its context is undefined or null', () => {
        const service = TestBed.inject(PipetteService);
        spyOn(service, 'getIsCursorOnCanvas').and.returnValue(true);
        spyOn(drawingService.baseCtx, 'fillRect');
        component.onMouseMove();
        expect(drawingService.baseCtx.fillRect).toHaveBeenCalledTimes(0);
    });
});
