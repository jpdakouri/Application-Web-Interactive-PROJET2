import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService, Status } from '@app/services/canvas-resizer/canvas-resizer.service';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { SIDEBAR_WIDTH } from '@app/services/services-constants';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolManagerServiceMock } from '@app/utils/tests-mocks/tool-manager-mock';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let mouseStub: MouseHandlerService;
    let canvasResizerStub: CanvasResizerService;

    let toolManagerServiceMock: ToolManagerServiceMock;
    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as CurrentColourService);
        drawingStub = new DrawingService();
        toolManagerServiceMock = new ToolManagerServiceMock();
        mouseStub = new MouseHandlerService();
        canvasResizerStub = new CanvasResizerService(drawingStub, mouseStub);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
                { provide: MouseHandlerService, useValue: mouseStub },
                { provide: ToolManagerService, useValue: toolManagerServiceMock },
                { provide: SaveDrawingService, useValue: {} },
            ],
            imports: [MatTooltipModule, HttpClientTestingModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        toolStub = toolManagerServiceMock.currentTool;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should call #updateCurrentTool and #subscribeToToolChange', () => {
        spyOn(component, 'updateCurrentTool').and.callThrough();
        spyOn(component, 'subscribeToToolChange').and.callThrough();
        component.ngOnInit();
        expect(component.updateCurrentTool).toHaveBeenCalled();
        expect(component.subscribeToToolChange).toHaveBeenCalled();
    });

    it("#updateCurrentTool should set component's current tool to toolManagerService's current tool", () => {
        component.updateCurrentTool();
        expect(component.currentTool).toEqual(toolManagerServiceMock.currentTool);
    });

    it(' #subscribeToToolChange should subscribe to tool change emitter and call #updateCurrentTool on emission', () => {
        spyOn(component, 'updateCurrentTool').and.callThrough();
        toolManagerServiceMock.toolChangeEmitter.emit();
        expect(component.updateCurrentTool).toHaveBeenCalled();
    });

    it(" #should subscribe to DrawingService's subscribeToCreateNewDrawingEmitter", () => {
        spyOn(component, 'subscribeToCreateNewDrawingEmitter').and.stub();
        spyOn(canvasResizerStub, 'calculateCanvasSize').and.stub();
        spyOn(canvasResizerStub, 'updatePreviewCanvasSize').and.stub();

        drawingStub.createNewDrawingEmitter.emit();
        expect(canvasResizerStub.calculateCanvasSize).toHaveBeenCalled();
        expect(canvasResizerStub.updatePreviewCanvasSize).toHaveBeenCalled();
    });

    it(" #should subscribe to DrawingService's subscribeToNewDrawing", () => {
        spyOn(component, 'subscribeToNewDrawing').and.stub();
        spyOn(canvasResizerStub, 'updatePreviewCanvasSize').and.stub();

        drawingStub.newDrawing.emit();

        expect(canvasResizerStub.updatePreviewCanvasSize).toHaveBeenCalled();
    });

    it("#ngAfterViewInit should call darwingService's #restoreCanvas", () => {
        spyOn(drawingStub, 'restoreCanvas').and.callThrough();
        component.ngAfterViewInit();
        expect(drawingStub.restoreCanvas).toHaveBeenCalled();
    });

    it('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(toolStub);
        expect(currentTool).toEqual(toolManagerServiceMock.currentTool);
    });

    it(" should call the tool's #onMouseMove when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        // tslint:disable-next-line:no-any
        spyOn<any>(toolStub, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        toolStub.lineThickness = undefined;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove');
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("should call canvasResizer's #onMouseMove when resizing", () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    it(" should call the tool's #mouseDown when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("should call canvasResizer's #onMouseDown when resizing", () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    it('onContextMenu returns false if right clicked while pipette is in use', () => {
        component.toolManagerService.currentTool = ToolsNames.Pipette;
        expect(component.onContextMenu()).toBeFalse();
    });

    it('should resize the canvas on mouseUp when status is resizing', () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(canvasResizerStub.status).toBe(Status.OFF);
    });

    it(" should call the tool's #mouseUp when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
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

    it('canvasPreviewSize should be canvasSize on init', () => {
        const calculatedPreviewCanvasSize = component.getPreviewCanvasSize();
        const expectedPreviewCanvasSize = { x: component.width, y: component.height };
        expect(calculatedPreviewCanvasSize.x).toEqual(expectedPreviewCanvasSize.x);
        expect(calculatedPreviewCanvasSize.y).toEqual(expectedPreviewCanvasSize.y);
    });

    it(" should call the tool's mouse leave when receiving a mouse leave event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave');
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    it('#emitEditorMinWidth should call #computeEditorMinWidth', () => {
        spyOn(component, 'computeEditorMinWidth').and.callThrough();
        component.emitEditorMinWidth();
        expect(component.computeEditorMinWidth).toHaveBeenCalled();
    });
    it('#emitEditorMinWidth should emit correct value', () => {
        const FAKE_CANVAS_WIDTH = 100;
        const WORKING_ZONE_VISIBLE_PORTION = 100;
        // tslint:disable-next-line: no-string-literal
        component['canvasSize'].x = FAKE_CANVAS_WIDTH;
        const editorMinWidth = FAKE_CANVAS_WIDTH + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
        spyOn(component.editorMinWidthEmitter, 'emit');
        component.emitEditorMinWidth();
        expect(component.editorMinWidthEmitter.emit).toHaveBeenCalledWith(editorMinWidth);
    });

    it('#computeEditorMinWidth should compute the correct value', () => {
        const FAKE_CANVAS_WIDTH = 100;
        const WORKING_ZONE_VISIBLE_PORTION = 100;
        // tslint:disable-next-line: no-string-literal
        component['canvasSize'].x = FAKE_CANVAS_WIDTH;
        const editorMinWidth = FAKE_CANVAS_WIDTH + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
        expect(component.computeEditorMinWidth()).toEqual(editorMinWidth);
    });

    it(" should call the tool's mouse dbl click when receiving a mouse dbl click event", () => {
        const mouseEventSpy = spyOn(toolStub, 'onDblClick').and.callThrough();
        component.onDblClick();
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    it(" should call the tool's key down when receiving a key down event", () => {
        const event = {} as KeyboardEvent;
        const mouseEventSpy = spyOn(toolStub, 'onKeyDown').and.callThrough();
        component.onKeyDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's key up when receiving a key up event", () => {
        const event = {} as KeyboardEvent;
        const mouseEventSpy = spyOn(toolStub, 'onKeyUp').and.callThrough();
        component.onKeyUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
});
