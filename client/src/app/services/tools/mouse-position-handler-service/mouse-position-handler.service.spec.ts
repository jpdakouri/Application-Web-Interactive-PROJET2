import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MousePositionHandlerService } from './mouse-position-handler.service';

describe('MousePositionHandlerService', () => {
    let service: MousePositionHandlerService;
    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MousePositionHandlerService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(MousePositionHandlerService);

        // tslint:disable-next-line:no-any
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw rectangle/square in the first quadrant (+/+)', () => {
        service.mouseDownCoord = { x: 300, y: 200 };

        const grid = { x: 300, y: 200 } as Vec2;
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;

        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it('should draw a wide (height < width) rectangle/square in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -300, y: 200 };

        const grid = { x: -300, y: 200 } as Vec2;
        const expected = { x: -200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the fourth quadrant (+/-) ', () => {
        service.mouseDownCoord = { x: 300, y: -200 };
        const grid = { x: 300, y: -200 } as Vec2;
        const expected = { x: 200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the second quadrant (-/-)', () => {
        service.mouseDownCoord = { x: -300, y: -200 };
        const grid = { x: -300, y: -200 } as Vec2;
        const expected = { x: -200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a large (height > width) rectangle/square in the fourth quadrant (+/-)', () => {
        service.mouseDownCoord = { x: 200, y: -300 };
        const grid = { x: 200, y: -300 } as Vec2;

        const expected = { x: 200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it('should draw ellipse/circle in the first quadrant (+/+)', () => {
        service.mouseDownCoord = { x: 300, y: 200 };

        const grid = { x: 300, y: 200 } as Vec2;
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;

        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });

    it('should draw a wide (height < width) ellipse/circle in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -300, y: 200 };

        const grid = { x: -300, y: 200 } as Vec2;
        const expected = { x: -200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a wide (height < width) ellipse/circle in the fourth quadrant (+/-) ', () => {
        service.mouseDownCoord = { x: 300, y: -200 };
        const grid = { x: 300, y: -200 } as Vec2;
        const expected = { x: 200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a wide (height < width) ellipse/circle in the second quadrant (-/-)', () => {
        service.mouseDownCoord = { x: -300, y: -200 };
        const grid = { x: -300, y: -200 } as Vec2;
        const expected = { x: -200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });

    it(' should draw a large (height > width) ellipse/circle in the fourth quadrant (+/-)', () => {
        service.mouseDownCoord = { x: 200, y: -300 };
        const grid = { x: 200, y: -300 } as Vec2;

        const expected = { x: 200, y: -200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });

    it('should draw a wide (height < width) rectangle/square in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -200, y: 300 };

        const grid = { x: -200, y: 300 } as Vec2;
        const expected = { x: -200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val, grid);
        expect(grid).toEqual(expected);
    });

    it('should draw a wide (height < width) ellipse/circle in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -200, y: 300 };

        const grid = { x: -200, y: 300 } as Vec2;
        const expected = { x: -200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeCircle'](val, grid);
        expect(grid).toEqual(expected);
    });
});
