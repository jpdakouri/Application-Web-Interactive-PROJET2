import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolbarComponent } from './toolbar.component';

import SpyObj = jasmine.SpyObj;

describe('ToolbarComponent', () => {
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let toolManagerServiceSpy: SpyObj<ToolManagerService>;
    let drawingServiceSpy: SpyObj<DrawingService>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['createNewDrawing']);
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['setCurrentTool', 'emitToolChange', 'isCurrentTool']);

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
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(0)).not.toEqual([ToolsNames.Line]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(1)).toEqual([ToolsNames.Aerosol]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(1)).not.toEqual([ToolsNames.Ellipse]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(2)).toEqual([ToolsNames.Eraser]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(3)).toEqual([ToolsNames.Rectangle]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(3)).not.toEqual([ToolsNames.Aerosol]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(4)).toEqual([ToolsNames.Ellipse]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(5)).toEqual([ToolsNames.Line]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(5)).not.toEqual([ToolsNames.Pencil]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(6)).toEqual([ToolsNames.Pencil]);
        expect(toolManagerServiceSpy.isCurrentTool.calls.argsFor(6)).not.toEqual([ToolsNames.Eraser]);
    });

    it('should create new drawing when new drawing button is clicked', () => {
        component.onCreateNewDrawing();
        expect(drawingServiceSpy.createNewDrawing).toHaveBeenCalled();
    });
});