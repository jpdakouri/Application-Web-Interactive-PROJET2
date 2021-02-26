import { TestBed } from '@angular/core/testing';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';
import { AerosolCommand } from './aerosol-command';

describe('AerosolCommand', () => {
    it('should create an instance', () => {
        const tool = TestBed.inject(AerosolService);
        expect(new AerosolCommand(tool, 'rgba(0,0,0,1)', [])).toBeTruthy();
    });
});
