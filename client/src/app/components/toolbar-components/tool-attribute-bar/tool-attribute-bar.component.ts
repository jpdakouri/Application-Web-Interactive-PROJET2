import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Component({
    selector: 'app-tool-attribute-bar',
    templateUrl: './tool-attribute-bar.component.html',
    styleUrls: ['./tool-attribute-bar.component.scss'],
})
export class ToolAttributeBarComponent {
    toolsNames: typeof ToolsNames = ToolsNames;
    shapeStyle: typeof ShapeStyle = ShapeStyle;
    toolManagerService: ToolManagerService;

    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    onThicknessChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentLineThickness(event.value || undefined);
    }

    getCurrentLineThickness(): number | undefined {
        return this.toolManagerService.getCurrentLineThickness();
    }
    onShowDotChange(event: MatCheckboxChange): void {
        this.toolManagerService.setCurrentShowDots(event.checked);
    }
    onShapeStyleChange(event: MatButtonToggleChange): void {
        const shapeStyle: string = event.value;
        this.toolManagerService.setCurrentShapeStyle(shapeStyle);
    }
    getCurrentShapeStyle(): ShapeStyle | undefined {
        return this.toolManagerService.getCurrentShapeStyle();
    }

    onDotRadiusChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentDotRadius(event.value || undefined);
    }
    getCurrentDotRadius(): number | undefined {
        return this.toolManagerService.getCurrentDotRadius();
    }

    showLineThickness(): boolean {
        return (
            this.toolManagerService.isCurrentTool(ToolsNames.Pencil) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Eraser) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Line) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Rectangle) ||
            this.toolManagerService.isCurrentTool(ToolsNames.Ellipse)
        );
    }

    showEllipseTitle(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Ellipse);
    }
    showLineAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Line);
    }

    showShapeStyle(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Ellipse) || this.toolManagerService.isCurrentTool(ToolsNames.Rectangle);
    }

    showEraserThickness(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Eraser);
    }

    isChecked(shapeStyle: ShapeStyle): boolean {
        return this.getCurrentShapeStyle() === shapeStyle;
    }

    showAerosolAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Aerosol);
    }

    getCurrentEmissionFlow(): number | undefined {
        return this.toolManagerService.getCurrentEmissionFlow();
    }

    getCurrentDropletDiameter(): number | undefined {
        return this.toolManagerService.getCurrentDropletDiameter();
    }

    getCurrentJetDiameter(): number | undefined {
        return this.toolManagerService.getCurrentJetDiameter();
    }

    onEmissionFlowChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentEmissionFlow(event.value || undefined);
    }

    onDropletDiameterChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentDropletDiameter(event.value || undefined);
    }

    onJetDiameterChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentJetDiameter(event.value || undefined);
    }
}
