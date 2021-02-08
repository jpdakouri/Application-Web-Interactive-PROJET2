import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    editorMinWidth: Vec2;
    @ViewChild('editor') editor: ElementRef<HTMLCanvasElement>;

    ngAfterViewInit(): void {
        this.setEditorMinWidth();
    }

    saveEditorMinWidth(event: Vec2): void {
        this.editorMinWidth = event;
    }

    setEditorMinWidth(): void {
        this.editor.nativeElement.style.minWidth = this.editorMinWidth + 'px';
    }
}
