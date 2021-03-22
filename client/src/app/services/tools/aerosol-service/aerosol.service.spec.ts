import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { AerosolCommand } from '@app/classes/tool-commands/aerosol-command';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';

describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    // @ts-ignore
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

        service = TestBed.inject(AerosolService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        // tslint:disable-next-line:no-any
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        mouseEvent = {
            offsetX: 100,
            offsetY: 100,
            x: 100,
            y: 100,
            button: MouseButtons.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set mouseDown and isSpraying properties to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service['isSpraying']).toBeTrue();
        expect(service.mouseDown).toBeTrue();
    });

    it('mouseUp should set isSpraying property to false', () => {
        service.onMouseUp(mouseEvent);
        expect(service['isSpraying']).toBeFalse();
    });

    it('should clear previewContext on mouse down', () => {
        service.onMouseDown(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should spray on mouse down if mouse is down and isSpraying property is true', () => {
        service['mouseDown'] = true;
        service['isSpraying'] = true;
        // tslint:disable:no-any
        const spraySpy = spyOn<any>(service, 'spray').and.callThrough();

        service.onMouseDown(mouseEvent);

        expect(spraySpy).toHaveBeenCalled();
    });

    it('should not spray on mouse down if mouse is down and isSpraying property is false', () => {
        service['mouseDown'] = true;
        service['isSpraying'] = false;
        const spraySpy = spyOn<any>(service, 'spray').and.callThrough();

        service.onMouseDown(mouseEvent);

        expect(spraySpy).toHaveBeenCalled();
    });

    it('should clearInterval on mouse down and on mouse leave', () => {
        service['mouseDown'] = true;
        const clearIntervalSpy = spyOn<any>(window, 'clearInterval').and.callThrough();

        service.onMouseUp(mouseEvent);
        service.onMouseLeave(mouseEvent);

        expect(clearIntervalSpy).toHaveBeenCalledTimes(2);
    });

    it('#onMouseMove should set mouseCurrentPosition to correct position', () => {
        const expectedMouseCurrentPosition: Vec2 = { x: 100, y: 100 };

        service.onMouseMove(mouseEvent);

        expect(service['mouseCurrentPosition']).toEqual(expectedMouseCurrentPosition);
    });

    it('#onMouseEnter should set isSpraying property to true and call #spray if mouse is already down', () => {
        service['mouseDown'] = true;
        const spraySpy = spyOn<any>(service, 'spray').and.callThrough();

        service.onMouseEnter(mouseEvent);

        expect(service['isSpraying']).toBeTrue();
        expect(spraySpy).toHaveBeenCalled();
    });

    it('#getRandomOffsetInRadius should be able to get a random offset in radius', () => {
        const radius = 50;
        const randomValue = 0.5;
        const expectedRandomOffsetInRadius = { x: -25, y: 3.061616997868383e-15 } as Vec2;
        spyOn(Math, 'random').and.returnValue(randomValue);

        const calculatedRandomOffset = service['getRandomOffsetInRadius'](radius);

        expect(calculatedRandomOffset).toEqual(expectedRandomOffsetInRadius);
    });

    it('should be able to draw spray particles', () => {
        const position = { x: 5, y: 5 } as Vec2;
        const color = '#000';
        const radius = 5;
        const fillRectSpy = spyOn(drawServiceSpy.baseCtx, 'fillRect').withArgs(position.x, position.y, radius, radius).and.callThrough();

        service['drawSprayParticle'](drawServiceSpy.baseCtx, position, color, radius);

        expect(fillRectSpy).toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalledWith(position.x, position.y, radius, radius);
    });

    it('should be able to generate spray particles', () => {
        const getRandomOffsetSpy = spyOn<any>(service, 'getRandomOffsetInRadius').and.callThrough();
        const drawSprayParticleSpy = spyOn<any>(service, 'drawSprayParticle').and.callThrough();

        service['generateSprayParticles']();

        expect(drawSprayParticleSpy).toHaveBeenCalled();
        expect(getRandomOffsetSpy).toHaveBeenCalled();
    });

    it('executeCommand draws a particle for each sprayed dot', () => {
        const command = new AerosolCommand(
            service,
            '0,0,0,1',
            [
                { x: 0, y: 0 },
                { x: 2, y: 2 },
            ],
            1,
        );
        spyOn(TestBed.inject(DrawingService).baseCtx, 'fillRect');
        service.executeCommand(command);
        expect(TestBed.inject(DrawingService).baseCtx.fillRect).toHaveBeenCalledWith(0, 0, 1, 1);
        expect(TestBed.inject(DrawingService).baseCtx.fillRect).toHaveBeenCalledWith(2, 2, 1, 1);
    });
});
