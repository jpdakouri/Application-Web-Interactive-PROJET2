import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color';
import { BucketCommand } from '@app/classes/tool-commands/bucket-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { PaintBucketService } from './paint-bucket.service';
// tslint:disable: no-magic-numbers

describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let visitSpy = jasmine.createSpy();
    let visitNGSpy = jasmine.createSpy();
    let bfsSpy = jasmine.createSpy();
    let putRGBASpy = jasmine.createSpy();
    let getRGBASpy = jasmine.createSpy();
    let similarSpy = jasmine.createSpy();
    let isValidSpy = jasmine.createSpy();
    let getSpy = jasmine.createSpy();
    let putSpy = jasmine.createSpy();
    let setSpy = jasmine.createSpy();
    let fillSpy = jasmine.createSpy();
    let getCanvasSpy = jasmine.createSpy();
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let currentColorSpy: jasmine.SpyObj<CurrentColorService>;
    let undoRedoSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['getCanvas', 'getBaseContext', 'getPreviewContext']);
        currentColorSpy = jasmine.createSpyObj('CurrentColorService', ['getPrimaryColorRgba']);
        undoRedoSpy = jasmine.createSpyObj('UndoRedoService', ['addCommand']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: CurrentColorService, useValue: currentColorSpy },
                { provide: UndoRedoService, useValue: undoRedoSpy },
            ],
        });
        currentColorSpy.getPrimaryColorRgba.and.returnValue('rgba(255, 16, 16, 1)');
        service = TestBed.inject(PaintBucketService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const mousePosition: Vec2 = { x: 25, y: 25 };
        service.canvas.width = 50;
        service.canvas.height = 50;
        service.mouseDownCoord = { x: 25, y: 25 };
        fillSpy = spyOn(service, 'setFillColor');
        setSpy = spyOn(service, 'setStartColor');
        bfsSpy = spyOn(service, 'bfs');
        getCanvasSpy = spyOn(service, 'getCanvas');
        spyOn(service, 'getPositionFromMouse').and.returnValue(mousePosition);
        getRGBASpy = spyOn(service, 'getRGBAFromCoord').and.returnValue({ R: 0, G: 0, B: 0, A: 0 });
        visitSpy = spyOn(service, 'visit').and.callThrough();
        visitNGSpy = spyOn(service, 'visitNotContiguous').and.callThrough();
        putRGBASpy = spyOn(service, 'putRGBAInArray');
        similarSpy = spyOn(service, 'isSimilarColor').and.returnValue(true);
        putSpy = spyOn(service.baseCtx, 'putImageData');
        isValidSpy = spyOn(service, 'isValidCoord').and.callThrough();
        getSpy = spyOn(service.baseCtx, 'getImageData');
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

    it('#bfs(true) should call #visit and #putRGBInArray 2500 times', () => {
        bfsSpy.and.callThrough();
        service.bfs(true);
        expect(visitSpy.calls.count()).toEqual(2500);
        expect(putRGBASpy.calls.count()).toEqual(2500);
    });

    it('#bfs(true) should call #visit and #putRGBInArray 2500 times', () => {
        bfsSpy.and.callThrough();
        service.bfs(true);
        expect(visitSpy.calls.count()).toEqual(2500);
        expect(putRGBASpy.calls.count()).toEqual(2500);
    });

    it('#bfs(false) should call #visit and #putRGBInArray 2500 times', () => {
        bfsSpy.and.callThrough();
        service.bfs(false);
        expect(visitNGSpy.calls.count()).toEqual(2500);
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

    it('#getCanvas should get image from base canvas context', () => {
        // tslint:disable:no-string-literal
        getCanvasSpy.and.callThrough();
        service['drawingService'].baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service.getCanvas();
        expect(getSpy).toHaveBeenCalled();
    });

    it('#isTransparent should return true if Alpha value is 127 or 128 and RGBA are under 100 or Alpha == 0', () => {
        const expectTrue1 = service.isTransparent({ R: 90, G: 90, B: 90, A: 127 });
        const expectTrue2 = service.isTransparent({ R: 90, G: 90, B: 90, A: 128 });
        const expectTrue3 = service.isTransparent({ R: 150, G: 150, B: 150, A: 0 });
        expect(expectTrue1).toBeTruthy();
        expect(expectTrue2).toBeTruthy();
        expect(expectTrue3).toBeTruthy();
    });

    it('#isTransparent should return false if Alpha != 127 and != 128 and != 0', () => {
        const expectFalse1 = service.isTransparent({ R: 90, G: 90, B: 90, A: 129 });
        const expectFalse2 = service.isTransparent({ R: 150, G: 90, B: 90, A: 127 });
        const expectFalse3 = service.isTransparent({ R: 90, G: 90, B: 90, A: 1 });
        expect(expectFalse1).toBeFalsy();
        expect(expectFalse2).toBeFalsy();
        expect(expectFalse3).toBeFalsy();
    });

    it('#getRGBAFromCoord should return correct color', () => {
        getSpy.and.callThrough();
        getRGBASpy.and.callThrough();
        service.baseCtx.fillStyle = '#ff1010';
        service.baseCtx.fillRect(25, 25, 1, 1);
        service.canvasImageData = service.baseCtx.getImageData(0, 0, 50, 50);
        const red = service.getRGBAFromCoord(25, 25);
        const white = service.getRGBAFromCoord(26, 26);

        expect(red.R).toEqual(255);
        expect(red.G).toEqual(16);
        expect(red.B).toEqual(16);
        expect(red.A).toEqual(255);
        expect(white.R).toEqual(255);
        expect(white.G).toEqual(255);
        expect(white.B).toEqual(255);
        expect(white.A).toEqual(255);
    });

    it('#putRBAInArray should put fillColor in newCanvasImageData', () => {
        service.newCanvasImageData = new ImageData(50, 50);
        service.canvas.width = 50;
        putSpy.and.callThrough();
        getSpy.and.callThrough();
        putRGBASpy.and.callThrough();
        service.fillColor = { R: 16, G: 255, B: 16, A: 255 };
        service.putRGBAInArray(25, 25);
        service.baseCtx.putImageData(service.newCanvasImageData, 0, 0);
        const green = service.baseCtx.getImageData(25, 25, 1, 1);
        expect(green.data[0]).toEqual(16);
        expect(green.data[1]).toEqual(255);
        expect(green.data[2]).toEqual(16);
        expect(green.data[3]).toEqual(255);
    });

    it('#setStartColor should set start color with clicked color', () => {
        getSpy.and.callThrough();
        setSpy.and.callThrough();
        service.baseCtx.fillStyle = '#ff1010';
        service.baseCtx.fillRect(25, 25, 1, 1);
        service.mouseDownCoord.x = 25;
        service.mouseDownCoord.y = 25;
        service.setStartColor();
        expect(service.startColor.R).toEqual(255);
        expect(service.startColor.G).toEqual(16);
        expect(service.startColor.B).toEqual(16);
        expect(service.startColor.A).toEqual(255);
        service.baseCtx.fillStyle = 'rgba(255, 16, 16, 0)';
        service.baseCtx.clearRect(25, 25, 1, 1);
        service.baseCtx.fillRect(25, 25, 1, 1);
        service.setStartColor();
        expect(service.startColor.R).toEqual(255);
        expect(service.startColor.G).toEqual(255);
        expect(service.startColor.B).toEqual(255);
        expect(service.startColor.A).toEqual(255);
    });

    it('setFillColor should set the current fillColor attribute with current color from currentColorService', () => {
        fillSpy.and.callThrough();
        service.setFillColor();
        expect(service.fillColor.R).toEqual(255);
        expect(service.fillColor.G).toEqual(16);
        expect(service.fillColor.B).toEqual(16);
        expect(service.fillColor.A).toEqual(255);
    });

    it('#isSimilarColor should return true if colors are similar and false if not', () => {
        similarSpy.and.callThrough();
        service.startColor = { R: 220, G: 220, B: 220, A: 255 };
        service.bucketTolerance = 50;
        const expectTrue = service.isSimilarColor({ R: 100, G: 190, B: 190, A: 255 });
        const expectFalse = service.isSimilarColor({ R: 10, G: 10, B: 100, A: 255 });
        expect(expectTrue).toEqual(true);
        expect(expectFalse).toEqual(false);
    });
    it('if bucketTolerance = 0, #isSimilarColor should return true if colors are exactly the same and false if not', () => {
        similarSpy.and.callThrough();
        service.startColor = { R: 220, G: 220, B: 220, A: 255 };
        service.bucketTolerance = 0;
        const expectTrue = service.isSimilarColor({ R: 220, G: 220, B: 220, A: 255 });
        const expectFalse = service.isSimilarColor({ R: 220, G: 220, B: 219, A: 255 });
        expect(expectTrue).toEqual(true);
        expect(expectFalse).toEqual(false);
    });

    it('#onMouseDown should call undeRedoService #addCommand', () => {
        getCanvasSpy.and.stub();
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.startColor = { R: 1, G: 1, B: 1, A: 1 };
        service.fillColor = { R: 1, G: 1, B: 1, A: 1 };
        const event = { button: 0 } as MouseEvent;

        service.onMouseDown(event);
        expect(undoRedoSpy.addCommand).toHaveBeenCalled();
    });

    it('#executeCommand should call #bfs', () => {
        const command = new BucketCommand(service, {} as Color, {} as Color, 1, false, {} as Vec2);
        service.executeCommand(command);
        expect(service.bfs).toHaveBeenCalled();
    });
});
