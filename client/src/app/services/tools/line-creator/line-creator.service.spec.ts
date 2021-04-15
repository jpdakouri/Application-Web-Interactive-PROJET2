import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCreatorService } from './line-creator.service';

describe('LineCreatorService', () => {
    let service: LineCreatorService;

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

        service = TestBed.inject(LineCreatorService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        // tslint:disable-next-line:no-any
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it(' keys should perform their task', () => {
    //     service.started = true;
    //     service.mouseDownCoord = { x: 20, y: 20 };
    //     service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
    //     // tslint:disable-next-line:no-any
    //     spyOn<any>(service, 'previewUpdate').and.stub();
    //     service.onKeyDown({
    //         key: KeyboardButtons.Shift,
    //     } as KeyboardEvent);
    //     expect(service.shiftPressed).toBeTrue();

    //     service.onKeyDown({
    //         key: KeyboardButtons.Escape,
    //     } as KeyboardEvent);
    //     expect(service.started).toBeFalse();

    //     service.pathData.push({ x: 0, y: 0 }, service.mouseDownCoord);
    //     const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Backspace });
    //     service.onKeyDown(event);
    //     expect(event.preventDefault).toHaveBeenCalled();

    //     service.onKeyDown(event);
    //     expect(event.preventDefault).toHaveBeenCalled();
    // });
});
