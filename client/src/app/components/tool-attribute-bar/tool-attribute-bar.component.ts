import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { ShapeStyle } from '@app/enums/shape-style';
import { ToolsNames } from '@app/enums/tools-names';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

@Component({
    selector: 'app-tool-attribute-bar',
    templateUrl: './tool-attribute-bar.component.html',
    styleUrls: ['./tool-attribute-bar.component.scss'],
})
export class ToolAttributeBarComponent implements OnInit {
    toolsNames: typeof ToolsNames = ToolsNames;
    shapeStyle: typeof ShapeStyle = ShapeStyle;
    currentLineThickness?: number = 1;
    currentPrimaryColor?: string = '#000000';
    currentSecondaryColor?: string = '#000000';
    currentShapeStyle?: ShapeStyle = ShapeStyle.Outline;
    toolManagerService: ToolManagerService;
    shapeStyleSelection: Map<string, ShapeStyle> = new Map<string, ShapeStyle>();
    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    ngOnInit(): void {
        this.toolManagerService.toolChangeEmitter.subscribe((toolName: ToolsNames) => {
            this.updateAttributes(toolName);
        });
        this.shapeStyleSelection.set('Outline', ShapeStyle.Outline).set('Filled', ShapeStyle.Filled).set('FilledOutline', ShapeStyle.FilledOutline);
    }

    updateAttributes(toolName: ToolsNames): void {
        switch (toolName) {
            case ToolsNames.Pencil:
                this.updatePencilAttributes();
                break;

            case ToolsNames.Rectangle:
                this.updateRectangleAttributes();
                break;

            case ToolsNames.Ellipse:
                this.updateEllipseAttributes();
                break;

            case ToolsNames.Eraser:
                this.updateEraserAttributes();
                break;

            case ToolsNames.Line:
                this.updateLineAttributes();
                break;

            case ToolsNames.Aerosol:
                this.updateAerosolAttributes();
                break;

            default:
                break;
        }
    }

    updatePencilAttributes(): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();
        this.currentLineThickness = currentTool.currentLineThickness;
        this.currentPrimaryColor = currentTool.currentPrimaryColor;
    }

    updateRectangleAttributes(): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();
        this.currentLineThickness = currentTool.currentLineThickness;
        this.currentPrimaryColor = currentTool.currentPrimaryColor;
        this.currentSecondaryColor = currentTool.currentSecondaryColor;
        this.currentShapeStyle = currentTool.currentShapeStyle;
    }
    updateEllipseAttributes(): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();

        this.currentLineThickness = currentTool.currentLineThickness;
        this.currentPrimaryColor = currentTool.currentPrimaryColor;
        this.currentSecondaryColor = currentTool.currentSecondaryColor;
        this.currentShapeStyle = currentTool.currentShapeStyle;
    }
    updateEraserAttributes(): void {}
    updateLineAttributes(): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();
        this.currentLineThickness = currentTool.currentLineThickness;
    }
    updateAerosolAttributes(): void {}

    onThicknessChange(event: MatSliderChange): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();
        this.currentLineThickness = currentTool.currentLineThickness = event.value ? event.value : currentTool.currentLineThickness;
    }

    onShapeStyleChange(event: MatButtonToggleChange): void {
        const currentTool = this.toolManagerService.getCurrentToolInstance();
        const shapeStyle: string = event.value;
        this.currentShapeStyle = currentTool.currentShapeStyle = event.value
            ? this.shapeStyleSelection.get(shapeStyle)
            : currentTool.currentShapeStyle;
    }

    getCurrentTool(): ToolsNames {
        return this.toolManagerService.currentTool;
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

    showShapeStyle(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Ellipse) || this.toolManagerService.isCurrentTool(ToolsNames.Rectangle);
    }

    isChecked(shapeStyle: ShapeStyle): boolean {
        return this.currentShapeStyle === shapeStyle;
    }
}
