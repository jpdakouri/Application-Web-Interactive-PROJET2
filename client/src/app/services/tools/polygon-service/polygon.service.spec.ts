import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ShapeStyle } from '@app/utils/enums/shape-style';

import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
    let service: PolygonService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    // tslint:disable:no-any
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PolygonService);

        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButtons.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawPolygon if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawPolygonSpy = spyOn<any>(service, 'drawPolygon').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawPolygon if mouse was not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        const drawPolygonSpy = spyOn<any>(service, 'drawPolygon').and.callThrough();
        service.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawPolygon if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawPolygonSpy = spyOn<any>(service, 'drawPolygon').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawPolygon if mouse was not down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        const drawPolygonSpy = spyOn<any>(service, 'drawPolygon').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(drawPolygonSpy).not.toHaveBeenCalled();
    });

    it(' drawOutline should be called when no shapeStyle is selected', () => {
        service['shapeStyle'] = undefined;
        service.mouseDown = true;
        const drawOutlineSpy = spyOn<any>(service, 'drawOutLine').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawOutlineSpy).toHaveBeenCalled();
    });

    it(' drawOutline should be called when shapeStyle OutLine is selected', () => {
        service.mouseDown = true;
        service['lineThickness'] = undefined;
        service['shapeStyle'] = ShapeStyle.Outline;
        const drawOutlineSpy = spyOn<any>(service, 'drawOutLine').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawOutlineSpy).toHaveBeenCalled();
    });

    it(' drawFilled should be called when shapeeStyke Filled is selected', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.Filled;
        service['lineThickness'] = undefined;
        const drawFilledSpy = spyOn<any>(service, 'drawFilled').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledSpy).toHaveBeenCalled();
    });

    it(' drawFilledOutline should be called when shapeStyle  is selected', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.FilledOutline;
        service['lineThickness'] = undefined;
        const drawFilledOutlineSpy = spyOn<any>(service, 'drawFilledOutLine').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawFilledOutlineSpy).toHaveBeenCalled();
    });

    it('should draw a circle in the first quadrant', () => {
        service.mouseDownCoord = { x: 300, y: 200 };
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['drawCircle'](val);
        expect(val).toEqual(expected);
    });

    it('should draw a circle in the third quadrant', () => {
        service.mouseDownCoord = { x: -300, y: 200 };
        const expected = { x: -200, y: 200 } as Vec2;
        const value = service.mouseDownCoord;
        service['drawCircle'](value);
        expect(service['drawCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a circle in the fourth quadrant ', () => {
        service.mouseDownCoord = { x: 300, y: -200 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['drawCircle'](value);
        expect(service['drawCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a circle in the second quadrant ', () => {
        service.mouseDownCoord = { x: -300, y: -200 };
        const expected = { x: -200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['drawCircle'](value);
        expect(service['drawCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a large (height > width) ellipse/circle in the fourth quadrant ', () => {
        service.mouseDownCoord = { x: 200, y: -300 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['drawCircle'](value);
        expect(service['drawCircle'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' drawPerimeter works even when there is a negative coordinate in x', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        const finalGrid: Vec2 = { x: -100, y: 100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works even when there is a negative coordinate in y', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        const finalGrid: Vec2 = { x: 100, y: -100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works when mouse is in the first quadrant', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        service.mouseDownCoord = { x: 200, y: 200 };
        const finalGrid: Vec2 = { x: 100, y: 100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works when mouse is in the second quadrant', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        service.mouseDownCoord = { x: -200, y: -200 };
        const finalGrid: Vec2 = { x: 100, y: 100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works when mouse is in the third quadrant', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        service.mouseDownCoord = { x: -200, y: 200 };
        const finalGrid: Vec2 = { x: 100, y: 100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawPerimeter works when mouse is in the fourth quadrant', () => {
        const contextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['strokeRect', 'strokeStyle', 'setLineDash']);
        service.mouseDownCoord = { x: 200, y: -200 };
        const finalGrid: Vec2 = { x: 100, y: 100 };
        const drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        service['drawPreview'](contextSpyObj, finalGrid);
        expect(drawPreviewSpy).toHaveBeenCalledWith(contextSpyObj, finalGrid);
    });

    it(' drawOutLine sould call lineTo the right number of times', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.Outline;
        // tslint:disable-next-line:no-magic-numbers
        service.numberOfSides = 3;
        const lineToSpy = spyOn<any>(previewCtxStub, 'lineTo').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        // tslint:disable-next-line:no-magic-numbers
        expect(lineToSpy).toHaveBeenCalledTimes(2);
    });

    it(' drawFilled sould call lineTo the right number of times', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.Filled;
        // tslint:disable-next-line:no-magic-numbers
        service.numberOfSides = 3;
        const lineToSpy = spyOn<any>(previewCtxStub, 'lineTo').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        // tslint:disable-next-line:no-magic-numbers
        expect(lineToSpy).toHaveBeenCalledTimes(2);
    });

    it(' drawFilledOutLine sould call lineTo the right number of times', () => {
        service.mouseDown = true;
        service['shapeStyle'] = ShapeStyle.FilledOutline;
        // tslint:disable-next-line:no-magic-numbers
        service.numberOfSides = 3;
        const lineToSpy = spyOn<any>(previewCtxStub, 'lineTo').and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        // tslint:disable-next-line:no-magic-numbers
        expect(lineToSpy).toHaveBeenCalledTimes(2);
    });

    it(' onMouseLeave should set mouseOut at true', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseLeave(mouseEvent);
        expect(service['mouseOut']).toEqual(true);
    });

    it(' onMouseEnter should set mouseOut at false', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['mouseOut'] = true;
        service.onMouseEnter(mouseEvent);
        expect(service['mouseOut']).toEqual(false);
    });
});
