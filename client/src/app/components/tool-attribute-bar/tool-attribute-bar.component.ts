import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolsNames } from '@app/enums/tools-names';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

@Component({
    selector: 'app-tool-attribute-bar',
    templateUrl: './tool-attribute-bar.component.html',
    styleUrls: ['./tool-attribute-bar.component.scss'],
})
export class ToolAttributeBarComponent {
    toolsNames: typeof ToolsNames = ToolsNames;
    currentLineWidth: number = 1;
    toolManagerService: ToolManagerService;
    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    onThicknessChange(event: MatSliderChange): void {
        console.log(event.value);
    }

    getCurrentTool(): ToolsNames {
        return this.toolManagerService.currentTool;
    }

    isPencil(): boolean {
        return this.getCurrentTool() === this.toolsNames.Pencil;
    }
    // isEllipse(): boolean {
    //     return this.getCurrentTool() === this.toolsNames.Ellipse;
    // }
    // isRectangle(): boolean {
    //     return this.getCurrentTool() === this.toolsNames.Rectangle;
    // }
    // isLine(): boolean {
    //     return this.getCurrentTool() === this.toolsNames.Line;
    // }

    isLineWidth(): boolean {
        return this.isPencil();
    }
}
