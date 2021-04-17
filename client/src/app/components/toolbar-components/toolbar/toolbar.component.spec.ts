import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolbarComponent } from './toolbar.component';

import SpyObj = jasmine.SpyObj;

describe('ToolbarComponent', () => {
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let toolManagerServiceSpy: SpyObj<ToolManagerService>;
    let drawingServiceSpy: SpyObj<DrawingService>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['createNewDrawing', 'isCanvasBlank']);
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', [
            'setCurrentTool',
            'emitToolChange',
            'isCurrentTool',
            'getCurrentSelectionTool',
        ]);

        TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
            providers: [
                { provide: ToolManagerService, useValue: toolManagerServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            imports: [MatIconModule, MatDividerModule, MatButtonModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#setCurrentTool should call toolManagerService's #setCurrentTool and #emitToolChange with correct argument", () => {
        component.setCurrentTool(ToolsNames.Pencil);
        expect(toolManagerServiceSpy.emitToolChange).toHaveBeenCalledWith(ToolsNames.Pencil);
        expect(toolManagerServiceSpy.emitToolChange).not.toHaveBeenCalledWith(ToolsNames.Rectangle);
    });
    it("#isSelected should call toolManagerService's #isCurrentTool with correct argument", () => {
        // tslint:disable: no-magic-numbers
        component.isSelected(ToolsNames.Pencil);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(0)).toEqual([ToolsNames.Pencil]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(2)).toEqual([ToolsNames.Aerosol]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(4)).toEqual([ToolsNames.Line]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(6)).toEqual([ToolsNames.Rectangle]);
    });

    it('should create new drawing when new drawing button is clicked with true if successful', () => {
        spyOn(TestBed.inject(UndoRedoService), 'saveInitialState');
        component.onCreateNewDrawing();
        expect(drawingServiceSpy.createNewDrawing.and.returnValue(true)).toHaveBeenCalled();
    });

    it('should create new drawing when new drawing button is clicked, and if unsuccessful, does not save initial state for undo-redo', () => {
        spyOn(TestBed.inject(UndoRedoService), 'saveInitialState');
        component.onCreateNewDrawing();
        expect(drawingServiceSpy.createNewDrawing.and.returnValue(false)).toHaveBeenCalled();
        expect(TestBed.inject(UndoRedoService).saveInitialState).not.toHaveBeenCalled();
    });

    it('carouselClicked should be emitted when openCarousel is called', () => {
        spyOn(component.carouselClicked, 'emit');
        component.openCarousel();
        expect(component.carouselClicked.emit).toHaveBeenCalledWith(true);
    });

    it('saveButtonClicked should be emitted when saveDrawing is called', () => {
        spyOn(component.saveButtonClicked, 'emit');
        component.saveDrawing();
        expect(component.saveButtonClicked.emit).toHaveBeenCalledWith(true);
    });

    it('exportButtonClicked should be emitted when onExport is called', () => {
        spyOn(component.exportButtonClicked, 'emit');
        component.onExport();
        expect(component.exportButtonClicked.emit).toHaveBeenCalledWith(true);
    });

    it('selectedAll should be emitted when selectAll is called', () => {
        spyOn(component.selectedAll, 'emit');
        component.selectAll();
        expect(component.selectedAll.emit).toHaveBeenCalledWith(true);
    });
});
