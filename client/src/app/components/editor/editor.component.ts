import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { KeyboardButtons } from '@app/utils/enums/list-boutton-pressed';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    private toolFinder: Map<KeyboardButtons, ToolsNames>;

    constructor(private toolManagerService: ToolManagerService, private drawingService: DrawingService) {
        this.toolFinder = new Map<KeyboardButtons, ToolsNames>();
        this.toolFinder
            .set(KeyboardButtons.Line, ToolsNames.Line)
            .set(KeyboardButtons.Rectangle, ToolsNames.Rectangle)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Eraser, ToolsNames.Eraser)
            .set(KeyboardButtons.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButtons.Pencil, ToolsNames.Pencil);
    }
    editorMinWidth: number;
    @ViewChild('editor') editor: ElementRef<HTMLCanvasElement>;
    @ViewChild('container', { static: false }) container: ElementRef<HTMLCanvasElement>;

    ngAfterViewInit(): void {
        this.setEditorMinWidth();
    }

    saveEditorMinWidth(event: number): void {
        this.editorMinWidth = event;
    }

    setEditorMinWidth(): void {
        this.editor.nativeElement.style.minWidth = this.editorMinWidth + 'px';
    }
    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === KeyboardButtons.NewDrawing) {
            this.onCreateNewDrawing();
        }

        if (!event.shiftKey) {
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
}
