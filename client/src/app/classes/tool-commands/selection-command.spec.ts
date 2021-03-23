import { TestBed } from '@angular/core/testing';
import { SelectionEllipseService } from '@app/services/tools/selectionEllipse-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selectionRectangle-service/selection-rectangle.service';
import { SelectionCommand } from './selection-command';

describe('SelectionCommand', () => {
    it('should create an instance with rectangle selection', () => {
        expect(
            new SelectionCommand(
                TestBed.inject(SelectionRectangleService),
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { data: new Uint8ClampedArray(), height: 0, width: 0 },
            ),
        ).toBeTruthy();
    });

    it('should create an instance with ellipse selection', () => {
        expect(
            new SelectionCommand(
                TestBed.inject(SelectionEllipseService),
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { data: new Uint8ClampedArray(), height: 0, width: 0 },
            ),
        ).toBeTruthy();
    });
});
