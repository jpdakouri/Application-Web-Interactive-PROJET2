import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    toolsNames: typeof ToolsNames = ToolsNames;

    constructor(public toolManagerService: ToolManagerService, public drawingService: DrawingService, public undoRedo: UndoRedoService) {}

    setCurrentTool(toolName: ToolsNames): void {
        this.toolManagerService.emitToolChange(toolName);
    }

    isSelected(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }

    onCreateNewDrawing(): void {
        this.drawingService.createNewDrawing();
    }
}
