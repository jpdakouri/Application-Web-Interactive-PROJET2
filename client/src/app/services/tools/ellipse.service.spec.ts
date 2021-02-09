import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawEllipseSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        it(' mouseDown should set mouseDownCoord to correct position', () => {
            const expectedResult: Vec2 = { x: 25, y: 25 };
            service.onMouseDown(mouseEvent);
            expect(service.mouseDownCoord).toEqual(expectedResult);
        });

        it(' mouseDown should set mouseDown property to true on left click', () => {
            service.onMouseDown(mouseEvent);
            expect(service.mouseDown).toEqual(true);
        });

        it(' mouseDown should set mouseDown property to false on right click', () => {
            const mouseEventRClick = {
                offsetX: 25,
                offsetY: 25,
                button: 1, // TODO: Avoir ceci dans un enum accessible
            } as MouseEvent;
            service.onMouseDown(mouseEventRClick);
            expect(service.mouseDown).toEqual(false);
        });
    });
});
