import { TestBed } from '@angular/core/testing';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ShapeCommand } from './shape-command';

describe('EllipseCommand', () => {
    it('should create an instance with ellipse tool', () => {
        const tool = TestBed.inject(EllipseService);
        expect(new ShapeCommand(tool, 'rgba(0,0,0,1)', 'rgba(255,255,255,1)', 1, { x: 0, y: 0 }, { x: 2, y: 2 }, ShapeStyle.Filled)).toBeTruthy();
    });
    it('should create an instance with rectangle tool', () => {
        const tool = TestBed.inject(RectangleService);
        expect(new ShapeCommand(tool, 'rgba(0,0,0,1)', 'rgba(255,255,255,1)', 1, { x: 0, y: 0 }, { x: 2, y: 2 }, ShapeStyle.Filled)).toBeTruthy();
    });
});
