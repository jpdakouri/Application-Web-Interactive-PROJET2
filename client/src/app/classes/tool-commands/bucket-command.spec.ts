import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { PaintBucketService } from '@app/services/tools/paint-bucket-service/paint-bucket.service';
import { BucketCommand } from './bucket-command';

describe('BucketCommand', () => {
    it('should create an instance', () => {
        const testTool = TestBed.inject(PaintBucketService);
        const position: Vec2 = { x: 1, y: 1 };
        const fillColor: Color = { R: 1, G: 1, B: 1, A: 1 };
        const startColor: Color = { R: 1, G: 1, B: 1, A: 1 };
        const tolerance = 1;
        const isContiguous = false;
        expect(new BucketCommand(testTool, fillColor, startColor, tolerance, isContiguous, position)).toBeTruthy();
    });
});
