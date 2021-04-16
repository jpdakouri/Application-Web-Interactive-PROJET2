import { TestBed } from '@angular/core/testing';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { SelectionCommand } from './selection-command';

describe('SelectionCommand', () => {
    it('should create an instance ', () => {
        expect(
            new SelectionCommand(
                TestBed.inject(SelectionRectangleService),
                { x: 0, y: 0 },
                { data: new Uint8ClampedArray(), height: 0, width: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ),
        ).toBeTruthy();
    });
});
