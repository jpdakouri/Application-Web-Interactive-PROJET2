import { TestBed } from '@angular/core/testing';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { ResizeCommand } from './resize-command';

describe('ResizeCommand', () => {
    it('should create an instance', () => {
        const tool = TestBed.inject(CanvasResizerService);
        const testDimenstion = 100;
        expect(new ResizeCommand(tool, testDimenstion, testDimenstion)).toBeTruthy();
    });
});
