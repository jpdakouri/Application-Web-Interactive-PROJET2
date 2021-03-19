import { TestBed } from '@angular/core/testing';
import { PolygonService } from '@app/services/tools/polygon-service/polygon.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { PolygonCommand } from './polygon-command';

describe('PolygonCommand', () => {
    it('should create an instance', () => {
        const numberOfSides = 5;
        expect(new PolygonCommand(TestBed.inject(PolygonService), '255,255,255,1', '0,0,0,1', numberOfSides, ShapeStyle.Filled, 2)).toBeTruthy();
    });
});
