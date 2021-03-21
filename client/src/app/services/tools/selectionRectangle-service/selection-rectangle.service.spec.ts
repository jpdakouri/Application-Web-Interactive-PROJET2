import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { SelectionRectangleService } from './selection-rectangle.service';

describe('SelectionRectangleService', () => {
    let service: SelectionRectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(SelectionRectangleService);

        // tslint:disable-next-line:no-any
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

    it('mouseDown should set value to true on left click', () => {
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

    it('should draw rectangle/square in the first quadrant (+/+)', () => {
        service.mouseDownCoord = { x: 300, y: 200 };
        service['shiftDown'] = true;
        const expected = { x: 200, y: 200 } as Vec2;
        const val = service.mouseDownCoord;
        service['makeSquare'](val);
        expect(val).toEqual(expected);
    });

    it('should draw a wide (height < width) rectangle/square in the third quadrant (-/+)', () => {
        service.mouseDownCoord = { x: -300, y: 200 };
        const expected = { x: -200, y: 200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeSquare'](value);
        expect(service['makeSquare'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the fourth quadrant (+/-) ', () => {
        service.mouseDownCoord = { x: 300, y: -200 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeSquare'](value);
        expect(service['makeSquare'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a wide (height < width) rectangle/square in the second quadrant (-/-)', () => {
        service.mouseDownCoord = { x: -300, y: -200 };
        const expected = { x: -200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeSquare'](value);
        expect(service['makeSquare'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });

    it(' should draw a large (height > width) rectangle/square in the fourth quadrant (+/-)', () => {
        service.mouseDownCoord = { x: 200, y: -300 };
        const expected = { x: 200, y: -200 } as Vec2;
        const value = service.mouseDownCoord;
        service['makeSquare'](value);
        expect(service['makeSquare'](service.mouseDownCoord));
        expect(value).toEqual(expected);
    });
});
