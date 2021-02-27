import { Component } from '@angular/core';
import { EditorComponent } from '@app/components/editor/editor.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
    drawingService: DrawingService;

    constructor(toolManagerService: ToolManagerService, drawingService: DrawingService, private editorComponent: EditorComponent) {
        this.toolManagerService = toolManagerService;
        this.drawingService = drawingService;
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
        this.editorComponent.exportDrawing();
    }
}
