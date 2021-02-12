import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService } from '@app/services/tools/canvas-resizer/canvas-resizer.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

// TODO : Déplacer dans un fichier accessible à tous
// const DEFAULT_WIDTH = 1000;
// const DEFAULT_HEIGHT = 800;

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let mouseStub: MouseHandlerService;
    let canvasResizerStub: CanvasResizerService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as MouseHandlerService);
        drawingStub = new DrawingService();
        mouseStub = new MouseHandlerService();
        canvasResizerStub = new CanvasResizerService(drawingStub, mouseStub);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
                { provide: MouseHandlerService, useValue: mouseStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should change current tool to canvasResizer onmouseover', () => {
        const mouseEventSpy = spyOn(component, 'onMouseOver').and.callThrough();
        component.onMouseOver();
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(component.currentTool).toBe(canvasResizerStub);
    });

    it('should save the canvas state when a resizer is clicked', () => {
        const numberOfCallsToSaveCanvasMethod = 3;
        spyOn(drawingStub, 'saveCanvas');

        component.onMiddleRightResizerClick();
        component.onBottomRightResizerClick();
        component.onMiddleBottomResizerClick();
        expect(drawingStub.saveCanvas).toHaveBeenCalledTimes(numberOfCallsToSaveCanvasMethod);
    });

    it("should call CanvasResizerService's #onMiddleRightResizer when is called", () => {
        spyOn(canvasResizerStub, 'onMiddleRightResizerClick');
        component.onMiddleRightResizerClick();
        expect(canvasResizerStub.onMiddleRightResizerClick).toHaveBeenCalled();
    });

    it("should call CanvasResizerService's #onMiddleBottomResizerClick when is called", () => {
        spyOn(canvasResizerStub, 'onMiddleBottomResizerClick');
        component.onMiddleBottomResizerClick();
        expect(canvasResizerStub.onMiddleBottomResizerClick).toHaveBeenCalled();
    });

    it("should call CanvasResizerService's #onBottomRightResizerClick when is called", () => {
        spyOn(canvasResizerStub, 'onBottomRightResizerClick');
        component.onBottomRightResizerClick();
        expect(canvasResizerStub.onBottomRightResizerClick).toHaveBeenCalled();
    });

    it('should restore the canvas after #resize call', () => {
        spyOn(drawingStub, 'restoreCanvas');
        component.resizeCanvas();
        expect(drawingStub.restoreCanvas).toHaveBeenCalled();
    });
});
