import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from './paint-bucket.service';
// tslint:disable: no-magic-numbers

describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let visitSpy = jasmine.createSpy();
    let bfsSpy = jasmine.createSpy();
    let putRGBASpy = jasmine.createSpy();
    let getRGBASpy = jasmine.createSpy();
    let similarSpy = jasmine.createSpy();
    let isValidSpy = jasmine.createSpy();
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['getCanvas', 'getBaseContext']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });

        service = TestBed.inject(PaintBucketService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.getCanvas.and.returnValue(service.canvas);
        drawingServiceSpy.getBaseContext.and.returnValue(service.baseCtx);
        spyOn(service.baseCtx, 'getImageData');

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const mousePosition: Vec2 = { x: 25, y: 25 };
        service.canvas.width = 50;
        service.canvas.height = 50;
        service.mouseDownCoord = { x: 25, y: 25 };
        spyOn(service, 'getCanvas').and.callThrough();
        spyOn(service, 'setFillColor');
        spyOn(service, 'setStartColor');
        bfsSpy = spyOn(service, 'bfs');
        spyOn(service, 'getPositionFromMouse').and.returnValue(mousePosition);
        getRGBASpy = spyOn(service, 'getRGBAFromCoord').and.returnValue({ R: 0, G: 0, B: 0, A: 0 });
        visitSpy = spyOn(service, 'visit').and.callThrough();
        putRGBASpy = spyOn(service, 'putRGBAInArray');
        similarSpy = spyOn(service, 'isSimilarColor').and.returnValue(true);
        spyOn(service.baseCtx, 'putImageData');
        isValidSpy = spyOn(service, 'isValidCoord').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#OnMouseDown should call specific functions', () => {
        service.onMouseDown(mouseEvent);
        expect(service.getCanvas).toHaveBeenCalled();
        expect(service.setFillColor).toHaveBeenCalled();
        expect(service.setStartColor).toHaveBeenCalled();
        expect(service.bfs).toHaveBeenCalled();
    });

    it('#isValidCoord should return false on in invalid coord', () => {
        expect(service.isValidCoord(-1, 1)).toBeFalse();
        expect(service.isValidCoord(1, -1)).toBeFalse();
        expect(service.isValidCoord(50, 1)).toBeFalse();
        expect(service.isValidCoord(1, 50)).toBeFalse();
    });

    it('#isValidCoord should return true on in valid coord', () => {
        expect(service.isValidCoord(1, 49)).toBeTrue();
        expect(service.isValidCoord(49, 1)).toBeTrue();
    });

    it('#bfs should call #visit and #putRGBInArray 2500 times', () => {
        bfsSpy.and.callThrough();
        service.bfs();
        expect(visitSpy.calls.count()).toEqual(2500);
        expect(putRGBASpy.calls.count()).toEqual(2500);
    });
    it('#visit should call #getRGBAFromCoord 4 times and #isSimilarColor 3 times because of visited array', () => {
        isValidSpy.and.returnValue(true);
        const arrayStub2D = new Array<number[]>();
        const arrayStub1D = new Array<number>();
        for (let j = 0; j < 3; j++) {
            arrayStub1D.push(0);
        }
        for (let i = 0; i < 3; i++) {
            arrayStub2D.push(arrayStub1D);
        }
        service.visit(arrayStub2D, [{ x: 0, y: 0 }], 1, 1);

        expect(similarSpy.calls.count()).toEqual(3);
        expect(getRGBASpy.calls.count()).toEqual(4);
    });

    it('#getCanvas should call drawingService functions', () => {
        service.getCanvas();
        expect(drawingServiceSpy.getBaseContext).toHaveBeenCalled();
        expect(drawingServiceSpy.getCanvas).toHaveBeenCalled();
        expect(service.baseCtx.getImageData).toHaveBeenCalled();
    });
});
