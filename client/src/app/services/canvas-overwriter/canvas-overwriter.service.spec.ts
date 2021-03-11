import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';

import { CanvasOverwriterService } from './canvas-overwriter.service';

describe('CanvasOverwriterService', () => {
    let service: CanvasOverwriterService;
    let canvasTestHelper: CanvasTestHelper;
    let drawingService: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasOverwriterService);
        drawingService = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.baseCtx = baseCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('overwriteCanvasState overrides the state correctly', () => {
        const testColor = 'rgba(1,1,1,1)';
        const state: string[][] = [];
        const dimension = 100;
        for (let i = 0; i < dimension; i++) {
            const currentRow: string[] = [];
            for (let j = 0; j < dimension; j++) {
                currentRow.push(testColor);
            }
            state.push(currentRow);
        }
        service.overwriteCanvasState(state);

        let correctColors = 0;
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                if (state[j][i] === testColor) correctColors++;
            }
        }
        expect(correctColors).toBe(dimension * dimension);
    });
});
