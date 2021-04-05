import { TestBed } from '@angular/core/testing';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';
import { StampCommand } from './stamp-command';

describe('StampCommand', () => {
    it('should create an instance', () => {
        const tool = TestBed.inject(StampService);
        expect(new StampCommand(tool, 1, 1, { x: 1, y: 1 })).toBeTruthy();
    });
});
