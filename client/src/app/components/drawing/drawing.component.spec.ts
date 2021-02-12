import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/utils/tests-mocks/tool-manager-mock';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';
import { DrawingComponent } from './drawing.component';

// TODO : Déplacer dans un fichier accessible à tous
const TOOLBAR_WIDTH = 425;

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingStub: DrawingService;
    let toolManagerServiceMock: ToolManagerServiceMock;
    let toolStub: ToolStub;
    beforeEach(async(() => {
        drawingStub = new DrawingService();
        toolManagerServiceMock = new ToolManagerServiceMock();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolManagerService, useValue: toolManagerServiceMock },
            ],
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

    it('#subscribeToToolChange should subscribe to tool change emitter and call #updateCurrentTool on emission', () => {
        spyOn(component, 'updateCurrentTool').and.callThrough();
        toolManagerServiceMock.toolChangeEmitter.emit();
        expect(component.updateCurrentTool).toHaveBeenCalled();
    });

    it("#ngAfterViewInit should call darwingService's #restoreCanvas", () => {
        spyOn(drawingStub, 'restoreCanvas').and.callThrough();
        component.ngAfterViewInit();
        expect(drawingStub.restoreCanvas).toHaveBeenCalled();
    });

    // TO DO: il faut écrire au prof pour la deuxième branche du if

    it('canvas should have a default WIDTH and HEIGHT that is half of working zone dimensions', () => {
        const EXPECTED_CANVAS_WIDTH = 300;
        const EXPECTED_CANVAS_HEIGHT = 300;
        const WORKING_ZONE_HEIGHT = 600;
        const WORKING_ZONE_WIDTH = 600;
        spyOnProperty(window, 'innerHeight', 'get').and.returnValue(WORKING_ZONE_HEIGHT);
        spyOnProperty(window, 'innerWidth', 'get').and.returnValue(WORKING_ZONE_WIDTH + TOOLBAR_WIDTH);
        component.setCanvasSize();
        // tslint:disable: no-string-literal
        const canvasHeight = component['canvasSize'].y;
        const canvasWidth = component['canvasSize'].x;
        expect(canvasHeight).toEqual(EXPECTED_CANVAS_HEIGHT);
        expect(canvasWidth).toEqual(EXPECTED_CANVAS_WIDTH);
    });

    it('canvas should have a 250px WIDTH and HEIGHT that half of working zone dimensions is smaller than 250px', () => {
        const EXPECTED_CANVAS_WIDTH = 250;
        const EXPECTED_CANVAS_HEIGHT = 250;
        const WORKING_ZONE_HEIGHT = 400;
        const WORKING_ZONE_WIDTH = 400;
        spyOnProperty(window, 'innerHeight', 'get').and.returnValue(WORKING_ZONE_HEIGHT);
        spyOnProperty(window, 'innerWidth', 'get').and.returnValue(WORKING_ZONE_WIDTH + TOOLBAR_WIDTH);
        component.setCanvasSize();
        // tslint:disable: no-string-literal
        const canvasHeight = component['canvasSize'].y;
        const canvasWidth = component['canvasSize'].x;
        expect(canvasHeight).toEqual(EXPECTED_CANVAS_HEIGHT);
        expect(canvasWidth).toEqual(EXPECTED_CANVAS_WIDTH);
    });

    // it('canvas should have a default WIDTH and HEIGHT that is half of working zone dimensions', () => {
    //     const MINIMUM_CANVAS_WIDTH = 250;
    //     const MINIMUM_CANVAS_HEIGHT = 250;
    //     const spy = spyOnProperty(window, 'innerHeight', 'get').and.returnValue();
    //     const workingZoneWidth = window.innerWidth - TOOLBAR_WIDTH;
    //     const workingZoneHeight = window.innerHeight;
    //     // tslint:disable: no-string-literal
    //     const canvasHeight = component['canvasSize'].y;
    //     const canvasWidth = component['canvasSize'].x;
    //     const desiredCanvasHeight = workingZoneHeight / 2;
    //     const desiredCanvasWidth = workingZoneWidth / 2;
    //     if (desiredCanvasHeight < MINIMUM_CANVAS_HEIGHT || desiredCanvasWidth < MINIMUM_CANVAS_WIDTH) {
    //         expect(canvasHeight).toEqual(MINIMUM_CANVAS_HEIGHT);
    //         expect(canvasWidth).toEqual(MINIMUM_CANVAS_WIDTH);
    //     } else {
    //         expect(canvasHeight).toEqual(workingZoneHeight / 2);
    //         expect(canvasWidth).toEqual(workingZoneWidth / 2);
    //     }
    // });

    it('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(toolManagerServiceMock.currentTool);
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

    it(" should call the tool's mouse leave when receiving a mouse leave event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("#unloadHandler should call drawingService's #saveCanvas", () => {
        spyOn(drawingStub, 'saveCanvas').and.callThrough();
        component.unloadHandler();
        expect(drawingStub.saveCanvas).toHaveBeenCalled();
    });

    it('#emitEditorMinWidth should call #computeEditorMinWidth', () => {
        spyOn(component, 'computeEditorMinWidth').and.callThrough();
        component.emitEditorMinWidth();
        expect(component.computeEditorMinWidth).toHaveBeenCalled();
    });
    it('#emitEditorMinWidth should emit correct value', () => {
        const SIDEBAR_WIDTH = 425;
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
        const SIDEBAR_WIDTH = 425;
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
