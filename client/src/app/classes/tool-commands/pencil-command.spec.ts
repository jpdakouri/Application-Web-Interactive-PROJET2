import { TestBed } from '@angular/core/testing';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { PencilCommand } from './pencil-command';

describe('PencilCommand', () => {
    it('should create an instance', () => {
        const testTool = TestBed.inject(PencilService);
        expect(new PencilCommand(testTool, 'rgba(0,0,0,1)', 1, [{ x: 0, y: 0 }, undefined])).toBeTruthy();
    });
});
