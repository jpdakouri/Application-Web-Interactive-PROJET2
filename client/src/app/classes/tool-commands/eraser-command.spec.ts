import { TestBed } from '@angular/core/testing';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { EraserCommand } from './eraser-command';

describe('EraserCommand', () => {
    it('should create an instance', () => {
        const tool = TestBed.inject(EraserService);
        expect(new EraserCommand(tool, 1, [])).toBeTruthy();
    });
});
