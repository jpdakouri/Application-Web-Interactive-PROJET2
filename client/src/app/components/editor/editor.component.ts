import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { KeyboardButton } from '@app/utils/enums/list-boutton-pressed';
import { ToolsNames } from '@app/utils/enums/tools-names';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    constructor(private toolManagerService: ToolManagerService) {
        this.toolFinder = new Map<KeyboardButton, ToolsNames>();
        this.toolFinder
            .set(KeyboardButton.Line, ToolsNames.Line)
            .set(KeyboardButton.Rectangle, ToolsNames.Rectangle)
            .set(KeyboardButton.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButton.Eraser, ToolsNames.Eraser)
            .set(KeyboardButton.Ellipse, ToolsNames.Ellipse)
            .set(KeyboardButton.Pencil, ToolsNames.Pencil);
    }
    editorMinWidth: number;
    @ViewChild('editor') editor: ElementRef<HTMLCanvasElement>;
    @ViewChild('container', { static: false }) container: ElementRef<HTMLCanvasElement>;

    private toolFinder: Map<KeyboardButton, ToolsNames>;

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
        if (!event.shiftKey) {
            const toolKeyDown = this.toolFinder.get(event.key as KeyboardButton) as ToolsNames;
            if (!(toolKeyDown == undefined)) {
                console.log(toolKeyDown);
                this.toolManagerService.setCurrentTool(toolKeyDown);
                this.toolManagerService.emitToolChange(toolKeyDown);
            }
        }
    }
}
