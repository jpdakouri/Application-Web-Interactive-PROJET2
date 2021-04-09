import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEllipseService } from '@app/services/tools/selection-ellipse-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends Tool {
    private clipboardContent?: ImageData;
    private pasteCount: number;
    private activeSelectionService?: SelectionEllipseService | SelectionRectangleService;

    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
        this.reset();
    }

    copy(): void {
        if (this.activeSelectionService != undefined) {
            // TODO
        }
    }
    paste(): void {
        if (this.activeSelectionService != undefined) {
            // TODO
        }
    }
    delete(): void {
        if (this.activeSelectionService != undefined) {
            // TODO
        }
    }
    cut(): void {
        if (this.activeSelectionService != undefined) {
            // TODO
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

    private setActiveSelectionService(service?: SelectionRectangleService | SelectionEllipseService) {
        this.activeSelectionService = service;
    }
}
