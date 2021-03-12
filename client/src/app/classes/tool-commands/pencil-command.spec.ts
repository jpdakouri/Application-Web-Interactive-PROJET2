import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { PencilCommand } from './pencil-command';

describe('PencilCommand', () => {
    it('should create an instance', () => {
        const testTool = TestBed.inject(PencilService);
        const position: Vec2 = { x: 1, y: 1 };
        expect(new PencilCommand(testTool, 'rgba(0,0,0,1)', 1, [[position]])).toBeTruthy();
    });
});
