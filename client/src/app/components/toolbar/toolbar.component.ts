import { Component } from '@angular/core';
import { ToolsNames } from '../../enums/tools-names';
import { ToolManagerService } from '../../services/tool-manager/tool-manager.service';
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
        this.toolManagerService.toolChangeEmitter.emit(toolName);
    }

    isCurrentTool(toolName: ToolsNames): string {
        return this.toolManagerService.currentTool === toolName ? 'accent' : 'primary';
    }
}
