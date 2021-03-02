import { Component, EventEmitter, Output } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    @Output() exportButtonClicked: EventEmitter<boolean>;

    toolsNames: typeof ToolsNames = ToolsNames;
    toolManagerService: ToolManagerService;
    drawingService: DrawingService;

    constructor(toolManagerService: ToolManagerService, drawingService: DrawingService) {
        this.toolManagerService = toolManagerService;
        this.drawingService = drawingService;
        this.exportButtonClicked = new EventEmitter<boolean>();
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.toolManagerService.emitToolChange(toolName);
    }

    isSelected(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }

    onCreateNewDrawing(): void {
        this.drawingService.createNewDrawing();
    }

    onExport(): void {
        this.exportButtonClicked.emit(true);
    }
}
