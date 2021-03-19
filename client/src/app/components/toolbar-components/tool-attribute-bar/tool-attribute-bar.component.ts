import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import {
    MAX_DROPLET_DIAMETER,
    MAX_FREQUENCY,
    MAX_JET_DIAMETER,
    MIN_DROPLET_DIAMETER,
    MIN_FREQUENCY,
    MIN_JET_DIAMETER,
} from '@app/services/tools/tools-constants';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Component({
    selector: 'app-tool-attribute-bar',
    templateUrl: './tool-attribute-bar.component.html',
    styleUrls: ['./tool-attribute-bar.component.scss'],
})
export class ToolAttributeBarComponent {
    readonly MIN_FREQUENCY: number = MIN_FREQUENCY;
    readonly MIN_JET_DIAMETER: number = MIN_JET_DIAMETER;
    readonly MIN_DROPLET_DIAMETER: number = MIN_DROPLET_DIAMETER;
    readonly MAX_FREQUENCY: number = MAX_FREQUENCY;
    readonly MAX_JET_DIAMETER: number = MAX_JET_DIAMETER;
    readonly MAX_DROPLET_DIAMETER: number = MAX_DROPLET_DIAMETER;

    toolsNames: typeof ToolsNames = ToolsNames;
    shapeStyle: typeof ShapeStyle = ShapeStyle;
    toolManagerService: ToolManagerService;

    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    showLineThickness(): boolean {
        return (
            this.toolManagerService.isCurrentTool(ToolsNames.Pencil) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Eraser) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Line) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Rectangle) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Ellipse) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Polygon)
        );
    }

    showEllipseTitle(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Ellipse);
    }

    showLineAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Line);
    }

    showShapeStyle(): boolean {
        return (
            this.toolManagerService.isCurrentTool(ToolsNames.Ellipse) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Rectangle) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Polygon)
        );
    }

    showEraserThickness(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Eraser);
    }

    showAerosolAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Aerosol);
    }

    showPolygonAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Polygon);
    }

    showPipettePreview(): boolean {
        // TODO: changer pour visible seulement si pipette active
        return this.toolManagerService.isCurrentTool(ToolsNames.Pipette);
    }

    isChecked(shapeStyle: ShapeStyle): boolean {
        return this.getCurrentShapeStyle() === shapeStyle;
    }

    getCurrentLineThickness(): number | undefined {
        return this.toolManagerService.getCurrentLineThickness();
    }

    getCurrentDotRadius(): number | undefined {
        return this.toolManagerService.getCurrentDotRadius();
    }

    getCurrentFrequency(): number | undefined {
        return this.toolManagerService.getCurrentFrequency();
    }

    getCurrentDropletDiameter(): number | undefined {
        return this.toolManagerService.getCurrentDropletDiameter();
    }

    getCurrentJetDiameter(): number | undefined {
        return this.toolManagerService.getCurrentJetDiameter();
    }

    getCurrentShapeStyle(): ShapeStyle | undefined {
        return this.toolManagerService.getCurrentShapeStyle();
    }

    getCurrentNumberOfSides(): number | undefined {
        return this.toolManagerService.getCurrentNumberOfSides();
    }

    onThicknessChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentLineThickness(event.value || undefined);
    }

    onShowDotChange(event: MatCheckboxChange): void {
        this.toolManagerService.setCurrentShowDots(event.checked);
    }

    onShapeStyleChange(event: MatButtonToggleChange): void {
        const shapeStyle: string = event.value;
        this.toolManagerService.setCurrentShapeStyle(shapeStyle);
    }

    onDotRadiusChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentDotRadius(event.value || undefined);
    }

    onFrequencyChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentFrequency(event.value || undefined);
    }

    onDropletDiameterChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentDropletDiameter(event.value || undefined);
    }

    onJetDiameterChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentJetDiameter(event.value || undefined);
    }

    onNumberOfSidesChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentNumberOfSides(event.value || undefined);
    }
}
