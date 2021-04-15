import { Injectable } from '@angular/core';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private clipboardContent?: ImageData;
    constructor(private toolManager: ToolManagerService) {}

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
                selectionTool.registerUndo(selectionTool.getSelectionImageData());
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
        // Dummy image data because redoing a delete command has no selection movement.
        selectionTool.registerUndo(new ImageData(1, 1));
    }

    cut(): void {
        const selectionTool = this.toolManager.getCurrentSelectionTool();
        if (selectionTool == undefined) {
            return;
        }
        if (selectionTool.hasSelection()) {
            this.clipboardContent = selectionTool.getSelectionImageData();
            selectionTool.deselect();
            selectionTool.registerUndo(this.clipboardContent);
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
}
