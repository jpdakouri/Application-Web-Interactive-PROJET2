import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { ColourHistoryComponent } from '@app/components/colour-components/colour-history/colour-history.component';
import { ColourPaletteSelectorComponent } from '@app/components/colour-components/colour-palette-selector/colour-palette-selector.component';
import { ColourSelectorComponent } from '@app/components/colour-components/colour-selector/colour-selector.component';
import { CurrentColourComponent } from '@app/components/colour-components/current-color/current-colour.component';
import { HueSelectorComponent } from '@app/components/colour-components/hue-selector/hue-selector.component';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolAttributeBarComponent } from './tool-attribute-bar.component';

import SpyObj = jasmine.SpyObj;

describe('ToolAttributeBarComponent', () => {
    let component: ToolAttributeBarComponent;
    let fixture: ComponentFixture<ToolAttributeBarComponent>;
    let toolManagerServiceSpy: SpyObj<ToolManagerService>;

    beforeEach(async(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', [
            'setCurrentLineThickness',
            'getCurrentLineThickness',
            'isCurrentTool',
            'setCurrentShowDots',
            'setCurrentShapeStyle',
            'getCurrentShapeStyle',
            'getCurrentDotRadius',
            'setCurrentDotRadius',
            'isCurrentTool',
            'setCurrentTool',
        ]);
        TestBed.configureTestingModule({
            declarations: [
                ToolAttributeBarComponent,
                ColourSelectorComponent,
                ColourHistoryComponent,
                CurrentColourComponent,
                ColourPaletteSelectorComponent,
                HueSelectorComponent,
            ],
            providers: [{ provide: ToolManagerService, useValue: toolManagerServiceSpy }],
            imports: [MatButtonToggleModule, MatSliderModule, MatDividerModule, MatCheckboxModule, FormsModule, MatIconModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolAttributeBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#onThicknessChange should call toolManagerService's #setCurrentLineThickness with correct parameter", () => {
        const FAKE_THICKNESS_VALUE = 10;
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = FAKE_THICKNESS_VALUE;
        component.onThicknessChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentLineThickness).toHaveBeenCalledWith(FAKE_THICKNESS_VALUE);
    });

    it(`#onThicknessChange should call toolManagerService's #setCurrentLineThickness with undefined paramater 
        if MatSliderChange's value is null`, () => {
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = null;
        component.onThicknessChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentLineThickness).toHaveBeenCalledWith(undefined);
    });

    it("#getCurrentLineThickness should call toolManagerService's #getCurrentLineThickness and return correct value", () => {
        const FAKE_THICKNESS_VALUE = 10;
        toolManagerServiceSpy.getCurrentLineThickness.and.returnValue(FAKE_THICKNESS_VALUE);
        const lineThickness = component.getCurrentLineThickness();
        expect(toolManagerServiceSpy.getCurrentLineThickness).toHaveBeenCalled();
        expect(lineThickness).toEqual(FAKE_THICKNESS_VALUE);
    });
    it("#getCurrentDotRadius should call toolManagerService's #getCurrentDotRadius and return correct value", () => {
        const FAKE_RADIUS_VALUE = 10;
        toolManagerServiceSpy.getCurrentDotRadius.and.returnValue(FAKE_RADIUS_VALUE);
        const dotRadius = component.getCurrentDotRadius();
        expect(toolManagerServiceSpy.getCurrentDotRadius).toHaveBeenCalled();
        expect(dotRadius).toEqual(FAKE_RADIUS_VALUE);
    });

    it("#onShowDotChange should call toolManagerService's #setCurrentShowDots with correct parameter ", () => {
        const matCheckboxChange: MatCheckboxChange = new MatCheckboxChange();
        matCheckboxChange.checked = true;
        component.onShowDotChange(matCheckboxChange);
        expect(toolManagerServiceSpy.setCurrentShowDots).toHaveBeenCalledWith(true);
    });
    it("#onShapeStyleChange should call toolManagerService's #setCurrentShapeStyle with correct parameter ", () => {
        const matButtonToggle: any = undefined;
        const matButtonToggleValue = 'Outline';
        const matButtonToggleChange: MatButtonToggleChange = new MatButtonToggleChange(matButtonToggle, matButtonToggleValue);
        component.onShapeStyleChange(matButtonToggleChange);
        expect(toolManagerServiceSpy.setCurrentShapeStyle).toHaveBeenCalledWith(matButtonToggleValue);
    });

    it("#getCurrentShapeStyle should call toolManagerService's #getCurrentShapeStyle and return correct value", () => {
        const FAKE_SHAPE_STYLE = ShapeStyle.Outline;
        toolManagerServiceSpy.getCurrentShapeStyle.and.returnValue(FAKE_SHAPE_STYLE);
        const currentShapeStyle = component.getCurrentShapeStyle();
        expect(toolManagerServiceSpy.getCurrentShapeStyle).toHaveBeenCalled();
        expect(currentShapeStyle).toEqual(FAKE_SHAPE_STYLE);
    });

    it("#onDotRadiusChange should call toolManagerService's #setCurrentDotRadius with correct parameter ", () => {
        const FAKE_RADIUS_VALUE = 10;
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = FAKE_RADIUS_VALUE;
        component.onDotRadiusChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentDotRadius).toHaveBeenCalledWith(FAKE_RADIUS_VALUE);
    });

    it("#onDotRadiusChange should call toolManagerService's #setCurrentDotRadius undefined parameter if MatSliderChange's value is null ", () => {
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = null;
        component.onDotRadiusChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentDotRadius).toHaveBeenCalledWith(undefined);
    });

    it("#showLineThickness should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.showLineThickness()).toEqual(true);
        toolManagerServiceSpy.isCurrentTool.and.returnValue(false);
        expect(component.showLineThickness()).toEqual(false);
    });
    it("#showEllipseTitle should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.showEllipseTitle()).toEqual(true);
        toolManagerServiceSpy.isCurrentTool.and.returnValue(false);
        expect(component.showEllipseTitle()).toEqual(false);
    });
    it("#showLineAttributes should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.showLineAttributes()).toEqual(true);
        toolManagerServiceSpy.isCurrentTool.and.returnValue(false);
        expect(component.showLineAttributes()).toEqual(false);
    });
    it("#showShapeStyle should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.showShapeStyle()).toEqual(true);
        toolManagerServiceSpy.isCurrentTool.and.returnValue(false);
        expect(component.showShapeStyle()).toEqual(false);
    });
    it("#isChecked should return true only if it's parameter is the current shape style", () => {
        toolManagerServiceSpy.getCurrentShapeStyle.and.returnValue(ShapeStyle.Outline);
        expect(component.isChecked(ShapeStyle.Outline)).toEqual(true);
        expect(component.isChecked(ShapeStyle.Filled)).toEqual(false);
    });
});
