import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolsNames } from '@app/enums/tools-names';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

@Component({
    selector: 'app-tool-attribute-bar',
    templateUrl: './tool-attribute-bar.component.html',
    styleUrls: ['./tool-attribute-bar.component.scss'],
})
export class ToolAttributeBarComponent implements OnInit {
    toolsNames: typeof ToolsNames = ToolsNames;
    currentLineWidth: number = 1;
    toolManagerService: ToolManagerService;
    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    ngOnInit(): void {
        this.toolManagerService.toolChangeEmitter.subscribe((toolName: ToolsNames) => {
            this.updateAttributes();
        });
    }

    updateAttributes(): void {
        switch (this.getCurrentTool()) {
            case this.toolsNames.Pencil:
                this.updatePencilAttributes();
                break;
            case this.toolsNames.Eraser:
                this.updateEraserAttributes();
                break;
            case this.toolsNames.Rectangle:
                this.updateRectangleAttributes();
                break;
            case this.toolsNames.Ellipse:
                this.updateEllipseAttributes();
                break;
            case this.toolsNames.Line:
                this.updateLineAttributes();
                break;
            case this.toolsNames.Aerosol:
                this.updateAerosolAttributes();
                break;

            default:
                break;
        }
    }

    updatePencilAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }
    updateRectangleAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }
    updateEllipseAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }
    updateEraserAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }
    updateLineAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }
    updateAerosolAttributes(): void {
        console.log(this.toolManagerService.getCurrentToolInstance());
    }

    onThicknessChange(event: MatSliderChange): void {
        console.log(event.value);
    }

    getCurrentTool(): ToolsNames {
        return this.toolManagerService.currentTool;
    }

    isLineWidth(): boolean {
        return this.isPencil() || this.isEraser() || this.isLine() || this.isRectangle() || this.isEllipse();
    }

    isShapeStyle(): boolean {
        return this.isEllipse() || this.isRectangle();
    }

    isPencil(): boolean {
        return this.getCurrentTool() === this.toolsNames.Pencil;
    }
    isEllipse(): boolean {
        return this.getCurrentTool() === this.toolsNames.Ellipse;
    }
    isRectangle(): boolean {
        return this.getCurrentTool() === this.toolsNames.Rectangle;
    }
    isLine(): boolean {
        return this.getCurrentTool() === this.toolsNames.Line;
    }
    isEraser(): boolean {
        return this.getCurrentTool() === this.toolsNames.Eraser;
    }
    isAerosol(): boolean {
        return this.getCurrentTool() === this.toolsNames.Aerosol;
    }
}
