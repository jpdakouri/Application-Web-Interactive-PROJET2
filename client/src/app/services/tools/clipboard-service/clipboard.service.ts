import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
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
    private pastePosition: Vec2;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, toolManager: ToolManagerService) {
        super(drawingService, currentColorService);
        this.reset();
        this.toolManager = toolManager;
    }

    copy(): void {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return;
        }
        if (selectionTool.hasSelection()) {
            this.clipboardContent = selectionTool.getSelectionImageData();
            this.pastePosition = selectionTool.topLeftCorner;
            this.pasteCount = 0;
        }
    }
    paste(): void {
        if (!this.clipboardContent) return;
        else {
            const selectionTool = this.toolManager.getCurrentSelectionTool();
            if (selectionTool == undefined) {
                return;
            }
            if (selectionTool.hasSelection()) {
                selectionTool.drawSelectionOnBase(selectionTool.getSelectionImageData(), selectionTool.topLeftCorner);
                selectionTool.deselect();
            }
            selectionTool.drawSelectionOnBase(this.clipboardContent, this.pastePosition);
            this.pasteCount += 1;
            // TODO: changement position
        }
    }
    delete(): void {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return;
        }
        selectionTool.deselect();
    }

    cut(): void {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return;
        }
        if (selectionTool.hasSelection()) {
            this.clipboardContent = selectionTool.getSelectionImageData();
            selectionTool.deselect();
            this.pastePosition = selectionTool.topLeftCorner;
            this.pasteCount = 0;
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
