import { Component, EventEmitter, Output } from '@angular/core';
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
    @Output() exportButtonClicked: EventEmitter<boolean>;
    @Output() saveButtonClicked: EventEmitter<boolean>;
    @Output() carouselClicked: EventEmitter<boolean>;
    @Output() selectedAll: EventEmitter<boolean>;

    toolsNames: typeof ToolsNames = ToolsNames;
    toolManagerService: ToolManagerService;
    drawingService: DrawingService;

    constructor(toolManagerService: ToolManagerService, drawingService: DrawingService, public undoRedo: UndoRedoService) {
        this.toolManagerService = toolManagerService;
        this.drawingService = drawingService;
        this.exportButtonClicked = new EventEmitter<boolean>();
        this.saveButtonClicked = new EventEmitter<boolean>();
        this.carouselClicked = new EventEmitter<boolean>();
        this.selectedAll = new EventEmitter<boolean>();
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.toolManagerService.emitToolChange(toolName);
    }

    isSelected(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }

    onCreateNewDrawing(): void {
        if (this.drawingService.createNewDrawing(true)) this.undoRedo.saveInitialState();
    }

    onExport(): void {
        this.exportButtonClicked.emit(true);
    }

    saveDrawing(): void {
        this.saveButtonClicked.emit(true);
    }

    openCarousel(): void {
        this.carouselClicked.emit(true);
    }

    selectAll(): void {
        this.selectedAll.emit(true);
    }

    onClickSelectedAll(): void {
        this.selectAll();
        this.setCurrentTool(this.toolsNames.SelectBox);
    }
}
