import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { ToolbarComponent } from '@app/components/toolbar-components/toolbar/toolbar.component';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
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
        private carouselService: CarouselService,
        public exportDrawingDialog: MatDialogRef<ExportDrawingComponent>,
        public saveDrawingDialog: MatDialogRef<SaveDrawingComponent>,
        public dialog: MatDialog,
    ) {
        this.toolFinder = new Map<KeyboardButtons, ToolsNames>();
        this.toolFinder
            .set(KeyboardButtons.Line, ToolsNames.Line)
            .set(KeyboardButtons.Rectangle, ToolsNames.Rectangle)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Eraser, ToolsNames.Eraser)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Pencil, ToolsNames.Pencil)
            .set(KeyboardButtons.Aerosol, ToolsNames.Aerosol);
    }

    ngAfterViewInit(): void {
        this.setEditorMinWidth();
    }

    saveEditorMinWidth(event: number): void {
        this.editorMinWidth = event;
    }

    setEditorMinWidth(): void {
        this.editor.nativeElement.style.minWidth = this.editorMinWidth + 'px';
    }

    // @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            if (event.key === KeyboardButtons.NewDrawing) this.onCreateNewDrawing();
            if (event.key === KeyboardButtons.Export) {
                event.preventDefault();
                this.openExportDrawingModal();
            }
            if (event.key === KeyboardButtons.Save) {
                event.preventDefault();
                this.openSaveDrawingModal();
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

    onCreateNewDrawing(): void {
        this.drawingService.createNewDrawing();
    }

    openSaveDrawingModal(): void {
        this.saveDrawingDialog = this.dialog.open(SaveDrawingComponent, {});
    }

    onExportDrawing(): void {
        this.openExportDrawingModal();
    }

    openExportDrawingModal(): void {
        this.exportDrawingDialog = this.dialog.open(ExportDrawingComponent, {});
    }

    openCarouselModal(): void {
        this.carouselService.openDialog();
    }
}
