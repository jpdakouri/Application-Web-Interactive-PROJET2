import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ToolbarComponent } from '@app/components/toolbar-components/toolbar/toolbar.component';
import { DialogControllerService } from '@app/services/dialog-controller/dialog-controller.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('editor') editor: ElementRef<HTMLCanvasElement>;
    @ViewChild('container', { static: false }) container: ElementRef<HTMLCanvasElement>;
    @ViewChild('toolbar', { static: false }) toolbar: ElementRef<ToolbarComponent>;

    private toolFinder: Map<KeyboardButtons, ToolsNames>;
    editorMinWidth: number;

    constructor(
        private toolManagerService: ToolManagerService,
        private drawingService: DrawingService,
        private dialogControllerService: DialogControllerService,
        private selectionRectangleService: SelectionRectangleService,
        private undoRedo: UndoRedoService,
    ) {
        this.toolFinder = new Map<KeyboardButtons, ToolsNames>();
        this.toolFinder
            .set(KeyboardButtons.Line, ToolsNames.Line)
            .set(KeyboardButtons.Rectangle, ToolsNames.Rectangle)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Eraser, ToolsNames.Eraser)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Pencil, ToolsNames.Pencil)
            .set(KeyboardButtons.Aerosol, ToolsNames.Aerosol)
            .set(KeyboardButtons.SelectionRectangle, ToolsNames.SelectBox)
            .set(KeyboardButtons.SelectionEllipse, ToolsNames.SelectEllipse)
            .set(KeyboardButtons.Polygon, ToolsNames.Polygon)
            .set(KeyboardButtons.Pipette, ToolsNames.Pipette);
    }

    ngAfterViewInit(): void {
        this.setEditorMinWidth();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.dialogControllerService.noDialogOpened) {
            if (event.ctrlKey) {
                if (event.key === KeyboardButtons.NewDrawing) if (this.onCreateNewDrawing()) this.undoRedo.saveInitialState();
                if (event.key === KeyboardButtons.Carousel) this.openCarouselModal();
                if (event.key === KeyboardButtons.Export) {
                    event.preventDefault();
                    this.openExportDrawingModal();
                }
                if (event.key === KeyboardButtons.Save) {
                    event.preventDefault();
                    this.openSaveDrawingModal();
                }
                if (event.key === KeyboardButtons.SelectAll) {
                    event.preventDefault();
                    this.selectAll();
                }
                if (event.key === KeyboardButtons.Undo) {
                    this.undoRedo.undo();
                }
                if (event.key === KeyboardButtons.Redo) {
                    this.undoRedo.redo();
                }
            }

            if (!event.shiftKey && !event.ctrlKey) {
                const toolKeyDown = this.toolFinder.get(event.key as KeyboardButtons) as ToolsNames;
                if (!(toolKeyDown == undefined)) {
                    this.toolManagerService.setCurrentTool(toolKeyDown);
                    this.toolManagerService.emitToolChange(toolKeyDown);
                }
            }
        }
    }

    saveEditorMinWidth(event: number): void {
        this.editorMinWidth = event;
    }

    setEditorMinWidth(): void {
        this.editor.nativeElement.style.minWidth = this.editorMinWidth + 'px';
    }

    onCreateNewDrawing(): boolean {
        return this.drawingService.createNewDrawing();
    }

    openSaveDrawingModal(): void {
        this.dialogControllerService.openDialog('save');
    }

    onExportDrawing(): void {
        this.openExportDrawingModal();
    }

    openExportDrawingModal(): void {
        this.dialogControllerService.openDialog('export');
    }

    openCarouselModal(): void {
        this.dialogControllerService.openDialog('carousel');
    }

    selectAll(): void {
        this.selectionRectangleService.selectAll();
    }
}
