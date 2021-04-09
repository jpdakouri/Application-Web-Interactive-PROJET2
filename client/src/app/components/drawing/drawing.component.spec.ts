import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanvasResizerService, Status } from '@app/services/canvas-resizer/canvas-resizer.service';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { SIDEBAR_WIDTH } from '@app/services/services-constants';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
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
        toolStub = new ToolStub({} as DrawingService, {} as CurrentColorService);
        drawingStub = new DrawingService();
        toolManagerServiceMock = new ToolManagerServiceMock();
        mouseStub = new MouseHandlerService();
        canvasResizerStub = new CanvasResizerService(mouseStub);

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

    xit('should create', () => {
        expect(component).toBeTruthy();
    });

    xit('#ngOnInit should call #updateCurrentTool and #subscribeToToolChange', () => {
        spyOn(component, 'updateCurrentTool').and.callThrough();
        spyOn(component, 'subscribeToToolChange').and.callThrough();
        component.ngOnInit();
        expect(component.updateCurrentTool).toHaveBeenCalled();
        expect(component.subscribeToToolChange).toHaveBeenCalled();
    });

    xit("#updateCurrentTool should set component's current tool to toolManagerService's current tool", () => {
        component.updateCurrentTool();
        expect(component.currentTool).toEqual(toolManagerServiceMock.currentTool);
    });

    xit(' #subscribeToToolChange should subscribe to tool change emitter and call #updateCurrentTool on emission', () => {
        spyOn(component, 'updateCurrentTool').and.callThrough();
        toolManagerServiceMock.toolChangeEmitter.emit();
        expect(component.updateCurrentTool).toHaveBeenCalled();
    });

    xit(" #should subscribe to DrawingService's subscribeToCreateNewDrawingEmitter", () => {
        spyOn(component, 'subscribeToCreateNewDrawingEmitter').and.stub();
        spyOn(canvasResizerStub, 'calculateCanvasSize').and.stub();
        spyOn(canvasResizerStub, 'updatePreviewCanvasSize').and.stub();

        drawingStub.createNewDrawingEmitter.emit();
        expect(canvasResizerStub.calculateCanvasSize).toHaveBeenCalled();
        expect(canvasResizerStub.updatePreviewCanvasSize).toHaveBeenCalled();
    });

    xit(" #should subscribe to DrawingService's subscribeToNewDrawing", () => {
        spyOn(component, 'subscribeToNewDrawing').and.stub();
        spyOn(canvasResizerStub, 'updatePreviewCanvasSize').and.stub();

        drawingStub.newDrawing.emit();

        expect(canvasResizerStub.updatePreviewCanvasSize).toHaveBeenCalled();
    });

    xit("#ngAfterViewInit should call darwingService's #restoreCanvas", () => {
        spyOn(drawingStub, 'restoreCanvas').and.callThrough();
        component.ngAfterViewInit();
        expect(drawingStub.restoreCanvas).toHaveBeenCalled();
    });

    xit('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(toolStub);
        expect(currentTool).toEqual(toolManagerServiceMock.currentTool);
    });

    xit(" should call the tool's #onMouseMove when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        // tslint:disable-next-line:no-any
        spyOn<any>(toolStub, 'getPositionFromMouse').and.returnValue({ x: 100, y: 100 });
        toolStub.lineThickness = undefined;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove');
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    xit("should call canvasResizer's #onMouseMove when resizing", () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    xit(" should call the tool's #mouseDown when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    xit("should call canvasResizer's #onMouseDown when resizing", () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    xit('onContextMenu returns true if right clicked while any other tool is in use', () => {
        component.toolManagerService.currentTool = ToolsNames.Pipette;
        expect(component.onContextMenu()).toBeFalse();
        component.toolManagerService.currentTool = ToolsNames.Line;
        expect(component.onContextMenu()).toBeTrue();
    });

    xit('should resize the canvas on mouseUp when status is resizing', () => {
        canvasResizerStub.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(canvasResizerStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(canvasResizerStub.status).toBe(Status.OFF);
    });

    xit(" should call the tool's #mouseUp when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    xit('should save the canvas state when a resizer is clicked', () => {
        const numberOfCallsToSaveCanvasMethod = 3;
        spyOn(drawingStub, 'saveCanvas');

        component.onMiddleRightResizerClick();
        component.onBottomRightResizerClick();
        component.onMiddleBottomResizerClick();
        expect(drawingStub.saveCanvas).toHaveBeenCalledTimes(numberOfCallsToSaveCanvasMethod);
    });

    xit("should call CanvasResizerService's #onMiddleRightResizer when is called", () => {
        spyOn(canvasResizerStub, 'onMiddleRightResizerClick');
        component.onMiddleRightResizerClick();
        expect(canvasResizerStub.onMiddleRightResizerClick).toHaveBeenCalled();
    });

    xit("should call CanvasResizerService's #onMiddleBottomResizerClick when is called", () => {
        spyOn(canvasResizerStub, 'onMiddleBottomResizerClick');
        component.onMiddleBottomResizerClick();
        expect(canvasResizerStub.onMiddleBottomResizerClick).toHaveBeenCalled();
    });

    xit("should call CanvasResizerService's #onBottomRightResizerClick when is called", () => {
        spyOn(canvasResizerStub, 'onBottomRightResizerClick');
        component.onBottomRightResizerClick();
        expect(canvasResizerStub.onBottomRightResizerClick).toHaveBeenCalled();
    });

    xit('should restore the canvas after #resize call', () => {
        spyOn(drawingStub, 'restoreCanvas');
        component.resizeCanvas();
        expect(drawingStub.restoreCanvas).toHaveBeenCalled();
    });

    xit('canvasPreviewSize should be canvasSize on init', () => {
        const calculatedPreviewCanvasSize = component.getPreviewCanvasSize();
        const expectedPreviewCanvasSize = { x: component.width, y: component.height };
        expect(calculatedPreviewCanvasSize.x).toEqual(expectedPreviewCanvasSize.x);
        expect(calculatedPreviewCanvasSize.y).toEqual(expectedPreviewCanvasSize.y);
    });

    xit(" should call the tool's mouse leave when receiving a mouse leave event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave');
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    xit(' onMouseMove should call resizing if canva is resizing', () => {
        const event = {} as MouseEvent;
        spyOn(canvasResizerStub, 'onMouseMove').and.stub();
        spyOn(canvasResizerStub, 'isResizing').and.returnValue(true);
        component.onMouseLeave(event);
        expect(canvasResizerStub.onMouseMove).toHaveBeenCalled();
    });

    xit(' onMouseEnter should call onMouseEnter from tool', () => {
        const event = {} as MouseEvent;
        spyOn(component.currentTool, 'onMouseEnter').and.stub();
        component.onMouseEnter(event);
        expect(component.currentTool.onMouseEnter).toHaveBeenCalled();
    });

    xit(' onDrag should prevent default', () => {
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: MouseButtons.Left });
        component.onDrag(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    xit('#emitEditorMinWidth should call #computeEditorMinWidth', () => {
        spyOn(component, 'computeEditorMinWidth').and.callThrough();
        component.emitEditorMinWidth();
        expect(component.computeEditorMinWidth).toHaveBeenCalled();
    });
    xit('#emitEditorMinWidth should emit correct value', () => {
        const FAKE_CANVAS_WIDTH = 100;
        const WORKING_ZONE_VISIBLE_PORTION = 100;
        // tslint:disable-next-line: no-string-literal
        component['canvasSize'].x = FAKE_CANVAS_WIDTH;
        const editorMinWidth = FAKE_CANVAS_WIDTH + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
        spyOn(component.editorMinWidthEmitter, 'emit');
        component.emitEditorMinWidth();
        expect(component.editorMinWidthEmitter.emit).toHaveBeenCalledWith(editorMinWidth);
    });

    xit('#computeEditorMinWidth should compute the correct value', () => {
        const FAKE_CANVAS_WIDTH = 100;
        const WORKING_ZONE_VISIBLE_PORTION = 100;
        // tslint:disable-next-line: no-string-literal
        component['canvasSize'].x = FAKE_CANVAS_WIDTH;
        const editorMinWidth = FAKE_CANVAS_WIDTH + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
        expect(component.computeEditorMinWidth()).toEqual(editorMinWidth);
    });

    xit(" should call the tool's mouse dbl click when receiving a mouse dbl click event", () => {
        const mouseEventSpy = spyOn(toolStub, 'onDblClick').and.callThrough();
        component.onDblClick();
        expect(mouseEventSpy).toHaveBeenCalled();
    });

    xit(" should call the tool's key down when receiving a key down event", () => {
        const event = {} as KeyboardEvent;
        const mouseEventSpy = spyOn(toolStub, 'onKeyDown').and.callThrough();
        component.onKeyDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    xit(" should call the tool's key up when receiving a key up event", () => {
        const event = {} as KeyboardEvent;
        const mouseEventSpy = spyOn(toolStub, 'onKeyUp').and.callThrough();
        component.onKeyUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    xit('  getSelectedAreaSize should return correct values ', () => {
        component.selectionEllipseService.width = 2;
        component.selectionEllipseService.height = 2;

        expect(component.getSelectedAreaSize().x).toEqual(2);
        expect(component.getSelectedAreaSize().y).toEqual(2);
    });

    xit('getTopLeftCorner() should return correct values ', () => {
        component.selectionEllipseService.topLeftCorner.x = 2;
        component.selectionEllipseService.topLeftCorner.y = 2;

        expect(component.getTopLeftCorner().x).toEqual(2);
        expect(component.getTopLeftCorner().y).toEqual(2);
    });

    xit('getSelectedAreaSizeRectangle should return correct values ', () => {
        component.selectionRectangleService.width = 2;
        component.selectionRectangleService.height = 2;

        expect(component.getSelectedAreaSizeRectangle().x).toEqual(2);
        expect(component.getSelectedAreaSizeRectangle().y).toEqual(2);
    });

    xit('getTopLeftCornerRectangle should return correct values ', () => {
        component.selectionRectangleService.topLeftCorner.x = 2;
        component.selectionRectangleService.topLeftCorner.y = 2;

        expect(component.getTopLeftCornerRectangle().x).toEqual(2);
        expect(component.getTopLeftCornerRectangle().y).toEqual(2);
    });

    xit('onMouseWheelScroll delegates to the current tool', () => {
        const testTool = TestBed.inject(PencilService);
        component.currentTool = testTool;
        spyOn(testTool, 'onMouseWheelScroll');
        const event = new WheelEvent('mousewheel');
        component.onMouseWheelScroll(event);
        expect(testTool.onMouseWheelScroll).toHaveBeenCalled();
    });
});
