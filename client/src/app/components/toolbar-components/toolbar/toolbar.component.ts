import { Component } from '@angular/core';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    toolsNames: typeof ToolsNames = ToolsNames;
    toolManagerService: ToolManagerService;

    constructor(toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.toolManagerService.setCurrentTool(toolName);
        this.toolManagerService.emitToolChange(toolName);
    }

    isSelected(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }
}
