import { TestBed } from '@angular/core/testing';
import { LineService } from '@app/services/tools/line-service/line.service';
import { LineCommand } from './line-command';

describe('LineCommand', () => {
    it('should create an instance', () => {
        const tool = TestBed.inject(LineService);
        expect(new LineCommand(tool, 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 1, 1, [])).toBeTruthy();
    });
});
