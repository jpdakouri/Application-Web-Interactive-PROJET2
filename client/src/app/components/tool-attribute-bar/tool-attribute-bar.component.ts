import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { ShapeStyle } from '@app/enums/shape-style';
import { ToolsNames } from '@app/enums/tools-names';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

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
        event.value ? this.toolManagerService.setCurrentLineThickness(event.value) : this.toolManagerService.setCurrentLineThickness();
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

    onDotRadiusChange(event: MatSliderChange): void {
        event.value ? this.toolManagerService.setCurrentDotRadius(event.value) : this.toolManagerService.setCurrentDotRadius();
    }

    getCurrentShapeStyle(): ShapeStyle | undefined {
        return this.toolManagerService.getCurrentShapeStyle();
    }

    getCurrentDotRadius(): number | undefined {
        return this.toolManagerService.getCurrentDotRadius();
    }

    showLineWidth(): boolean {
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

    isChecked(shapeStyle: ShapeStyle): boolean {
        return this.getCurrentShapeStyle() === shapeStyle;
    }
}
