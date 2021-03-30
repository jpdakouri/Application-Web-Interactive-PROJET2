import { Component, Input } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/grid-service/grid.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { TextService } from '@app/services/tools/text/text.service';
import {
    MAX_DROPLET_DIAMETER,
    MAX_FREQUENCY,
    MAX_JET_DIAMETER,
    MIN_DROPLET_DIAMETER,
    MIN_FREQUENCY,
    MIN_JET_DIAMETER,
} from '@app/services/tools/tools-constants';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { TextAlign } from '@app/utils/enums/text-align.enum';

@Component({
    selector: 'app-tool-attribute',
    templateUrl: './tool-attribute.component.html',
    styleUrls: ['./tool-attribute.component.scss'],
})
export class ToolAttributeComponent {
    @Input() showGrid: boolean = false;
    readonly MIN_FREQUENCY: number = MIN_FREQUENCY;
    readonly MIN_JET_DIAMETER: number = MIN_JET_DIAMETER;
    readonly MIN_DROPLET_DIAMETER: number = MIN_DROPLET_DIAMETER;
    readonly MAX_FREQUENCY: number = MAX_FREQUENCY;
    readonly MAX_JET_DIAMETER: number = MAX_JET_DIAMETER;
    readonly MAX_DROPLET_DIAMETER: number = MAX_DROPLET_DIAMETER;

    toolsNames: typeof ToolsNames = ToolsNames;
    shapeStyle: typeof ShapeStyle = ShapeStyle;
    toolManagerService: ToolManagerService;

    constructor(toolManagerService: ToolManagerService, public gridService: GridService, public textService: TextService) {
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

    shapeStyleTitle(): string | void {
        if (this.toolManagerService.isCurrentTool(ToolsNames.Ellipse)) {
            return "'ellipse";
        } else if (this.toolManagerService.isCurrentTool(ToolsNames.Rectangle)) {
            return 'e rectangle';
        } else if (this.toolManagerService.isCurrentTool(ToolsNames.Polygon)) {
            return 'e polygone';
        }
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
        return this.toolManagerService.isCurrentTool(ToolsNames.Pipette);
    }

    showTextAttributes(): boolean {
        return this.toolManagerService.isCurrentTool(ToolsNames.Text);
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

    getCurrentFontSize(): number | undefined {
        return this.toolManagerService.getCurrentFontSize();
    }

    get textFonts(): string[] {
        return Object.values(TextFont);
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

    onFontSizeChange(event: MatSliderChange): void {
        this.toolManagerService.setCurrentFontSize(event.value || undefined);
        this.textService.draw();
    }

    onFontFaceChange(selectedFont?: string): void {
        this.toolManagerService.setCurrentFontFace(selectedFont || undefined);
        this.textService.draw();
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

    onGridSizeChange(event: MatSliderChange): void {
        if (this.showGrid) this.gridService.newGrid(event.value as number);
        else this.gridService.clear();
    }

    onGridOpacityChange(event: MatSliderChange): void {
        this.gridService.changeOpacity(event.value);
    }

    onTextAlignChange(value: string): void {
        this.textService.textAlign = value as TextAlign;
        this.textService.draw();
    }
}
