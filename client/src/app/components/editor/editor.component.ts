import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ToolsNames } from '@app/enums/tools-names';
import { KeyboardButton } from '@app/list-boutton-pressed';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('container', { static: false }) container: ElementRef<HTMLCanvasElement>;
    private toolFinder: Map<KeyboardButton, ToolsNames>;

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
