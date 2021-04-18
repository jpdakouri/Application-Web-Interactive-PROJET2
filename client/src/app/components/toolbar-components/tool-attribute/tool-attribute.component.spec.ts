import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorHistoryComponent } from '@app/components/color-components/color-history/color-history.component';
import { ColorPaletteSelectorComponent } from '@app/components/color-components/color-palette-selector/color-palette-selector.component';
import { ColorSelectorComponent } from '@app/components/color-components/color-selector/color-selector.component';
import { CurrentColorComponent } from '@app/components/color-components/current-color/current-color.component';
import { HueSelectorComponent } from '@app/components/color-components/hue-selector/hue-selector.component';
import { PipettePreviewComponent } from '@app/components/pipette-preview/pipette-preview.component';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolAttributeComponent } from './tool-attribute.component';

import SpyObj = jasmine.SpyObj;

describe('ToolAttributeBarComponent', () => {
    let component: ToolAttributeComponent;
    let fixture: ComponentFixture<ToolAttributeComponent>;
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
            'setCurrentFrequency',
            'setCurrentDropletDiameter',
            'setCurrentJetDiameter',
            'getCurrentNumberOfSides',
            'setCurrentNumberOfSides',
            'getCurrentTolerance',
            'getStampScalingFactor',
            'getStampRotationAngle',
            'getSelectedStamp',
            'setStampScalingFactor',
            'setStampRotationAngle',
            'setSelectedStamp',
        ]);
        TestBed.configureTestingModule({
            declarations: [
                ToolAttributeComponent,
                ColorSelectorComponent,
                ColorHistoryComponent,
                CurrentColorComponent,
                ColorPaletteSelectorComponent,
                HueSelectorComponent,
                PipettePreviewComponent,
            ],
            providers: [{ provide: ToolManagerService, useValue: toolManagerServiceSpy }],
            imports: [
                BrowserAnimationsModule,
                MatInputModule,
                MatButtonToggleModule,
                MatSliderModule,
                MatCheckboxModule,
                MatDividerModule,
                MatCheckboxModule,
                FormsModule,
                MatIconModule,
                MatOptionModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolAttributeComponent);
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
        // tslint:disable-next-line: no-any
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

    it("#onFrequencyChange should call toolManagerService's #setCurrentFrequency with correct parameter ", () => {
        const frequency = 10;
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = frequency;
        component.onFrequencyChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentFrequency).toHaveBeenCalledWith(frequency);
    });

    it("#onFrequencyChange should call toolManagerService's #setCurrentFrequency undefined parameter if MatSliderChange's value is null ", () => {
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = null;
        component.onFrequencyChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentFrequency).toHaveBeenCalledWith(undefined);
    });

    it("#onDropletDiameterChange should call toolManagerService's #setCurrentDropletDiameter with correct parameter ", () => {
        const dropletDiamter = 10;
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = dropletDiamter;
        component.onDropletDiameterChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentDropletDiameter).toHaveBeenCalledWith(dropletDiamter);
    });

    it("#onJetDiameterChange should call toolManagerService's #setCurrentJetDiameter with correct parameter ", () => {
        const jetDiameter = 10;
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = jetDiameter;
        component.onJetDiameterChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentJetDiameter).toHaveBeenCalledWith(jetDiameter);
    });

    it("#onDropletDiameterChange should call toolManagerService's #setCurrentDropletDiameter with correct parameter ", () => {
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = null;
        component.onDropletDiameterChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentDropletDiameter).toHaveBeenCalledWith(undefined);
    });

    it("#onJetDiameterChange should call toolManagerService's #setCurrentJetDiameter with correct parameter ", () => {
        const matSliderChange: MatSliderChange = new MatSliderChange();
        matSliderChange.value = null;
        component.onJetDiameterChange(matSliderChange);
        expect(toolManagerServiceSpy.setCurrentJetDiameter).toHaveBeenCalledWith(undefined);
    });

    it("#showLineThickness should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.showLineThickness()).toEqual(true);
        toolManagerServiceSpy.isCurrentTool.and.returnValue(false);
        expect(component.showLineThickness()).toEqual(false);
    });

    it("#showEllipseTitle should return true only if toolManagerService's #isCurrentTool returns true", () => {
        toolManagerServiceSpy.isCurrentTool.and.returnValue(true);
        expect(component.shapeStyleTitle()).toEqual("'ellipse");
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

    it('onNumberOfSidesChange should call setCurrentNumberOfSides from toolManagerService', () => {
        component.onNumberOfSidesChange({} as MatSliderChange);
        expect(toolManagerServiceSpy.setCurrentNumberOfSides).toHaveBeenCalled();
    });

    it('onGridSizeChange should call newGrid if showGrid is true', () => {
        spyOn(component.gridService, 'newGrid').and.stub();
        spyOn(component.gridService, 'clear').and.stub();
        component.gridService.showGrid = true;
        component.onGridSizeChange({} as MatSliderChange);
        expect(component.gridService.newGrid).toHaveBeenCalled();

        component.gridService.showGrid = false;
        component.onGridSizeChange({} as MatSliderChange);
        expect(component.gridService.clear).toHaveBeenCalled();
    });

    it('onGridOpacityChange should call the service to change the opacity', () => {
        spyOn(component.gridService, 'changeOpacity').and.stub();
        component.onGridOpacityChange({} as MatSliderChange);
        expect(component.gridService.changeOpacity).toHaveBeenCalled();
    });

    it('onStampScalingFactorChange calls the set function of Tool manager', () => {
        const event = new MatSliderChange();
        component.onStampScalingFactorChange(event);
        expect(toolManagerServiceSpy.setStampScalingFactor).toHaveBeenCalled();
    });

    it('onStampRotationAngleChange calls the set function of Tool manager', () => {
        const event = new MatSliderChange();
        component.onStampRotationAngleChange(event);
        expect(toolManagerServiceSpy.setStampRotationAngle).toHaveBeenCalled();
    });

    it('onSelectedStampChange calls the set function of Tool manager', () => {
        component.onSelectedStampChange('stub');
        expect(toolManagerServiceSpy.setSelectedStamp).toHaveBeenCalled();
    });

    it('getStampScalingFactor calls the get function of Tool manager', () => {
        component.getStampScalingFactor();
        expect(toolManagerServiceSpy.getStampScalingFactor).toHaveBeenCalled();
    });

    it('getStampRotationAngle calls the get function of Tool manager', () => {
        component.getStampRotationAngle();
        expect(toolManagerServiceSpy.getStampRotationAngle).toHaveBeenCalled();
    });

    it('getSelectedStamp calls the get function of Tool manager', () => {
        component.getSelectedStamp();
        expect(toolManagerServiceSpy.getSelectedStamp).toHaveBeenCalled();
    });
});
