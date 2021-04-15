import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends Tool {
    private clipboardContent?: ImageData;
    private toolManager: ToolManagerService;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, toolManager: ToolManagerService) {
        super(drawingService, currentColorService);
        this.toolManager = toolManager;
    }

    copy(): void {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return;
        }
        if (selectionTool.hasSelection()) {
            this.clipboardContent = selectionTool.getSelectionImageData();
        }
    }
    paste(): void {
        if (!this.clipboardContent) return;
        else {
            let selectionTool = this.toolManager.getCurrentSelectionTool();
            if (selectionTool == undefined) {
                this.toolManager.emitToolChange(ToolsNames.SelectBox);
                selectionTool = this.toolManager.toolBox.SelectBox as SelectionRectangleService;
            }
            if (selectionTool.hasSelection()) {
                selectionTool.drawSelectionOnBase(selectionTool.getSelectionImageData(), { ...selectionTool.topLeftCorner });
                selectionTool.deselect();
            }
            selectionTool.setSelection(this.clipboardContent);
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
        }
    }

    hasContent(): boolean {
        return this.clipboardContent !== undefined;
    }

    hasSelection(): boolean {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return false;
        }
        return selectionTool.hasSelection();
    }

    executeCommand(command: ToolCommand): void {
        // TODO
    }
}
