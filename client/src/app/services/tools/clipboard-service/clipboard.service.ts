import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends Tool {
    private clipboardContent?: ImageData;
    private pasteCount: number;
    private toolManager: ToolManagerService;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, toolManager: ToolManagerService) {
        super(drawingService, currentColorService);
        this.reset();
        this.toolManager = toolManager;
    }

    copy(): void {
        if (this.toolManager.getCurrentSelectionTool() == undefined) {
            return;
        }
    }
    paste(): void {
        if (this.activeSelectionService != undefined) {
            // TODO
        }
    }
    delete(): void {
        if (this.toolManager.getCurrentSelectionTool() == undefined) {
            return;
        }
    }
    cut(): void {
        if (this.toolManager.getCurrentSelectionTool() == undefined) {
            return;
        }
    }

    reset(): void {
        this.pasteCount = 0;
        this.clipboardContent = undefined;
    }

    hasContent(): boolean {
        return this.clipboardContent !== undefined;
    }

    executeCommand(command: ToolCommand): void {
        // TODO
    }
}
