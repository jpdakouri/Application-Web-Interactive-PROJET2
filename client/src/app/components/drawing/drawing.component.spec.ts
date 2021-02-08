import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/utils/tests-mocks/tool-manager-mock';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';
import { DrawingComponent } from './drawing.component';

// TODO : Déplacer dans un fichier accessible à tous
const TOOLBAR_WIDTH = 425;

fdescribe('DrawingComponent', () => {
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

    it('canvas should have a default WIDTH and HEIGHT that is half of working zone dimensions', () => {
        const workingZoneWidth = window.innerWidth - TOOLBAR_WIDTH;
        const workingZoneHeight = window.innerHeight;
        const canvasHeight = component.height;
        const canvasWidth = component.width;
        expect(canvasHeight).toEqual(workingZoneHeight / 2);
        expect(canvasWidth).toEqual(workingZoneWidth / 2);
    });

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

    it(" should call the tool's mouse leave when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
});
