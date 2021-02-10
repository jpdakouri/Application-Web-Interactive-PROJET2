import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/toolbar-components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar-components/toolbar/toolbar.component';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, ToolAttributeBarComponent, ToolbarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        console.log(component);
        expect(component).toBeTruthy();
    });

    it('#ngAfterViewInit should call #setEditorMinWidth', () => {
        spyOn(component, 'setEditorMinWidth').and.callThrough();
        component.ngAfterViewInit();
        expect(component.setEditorMinWidth).toHaveBeenCalled();
    });
    it('#saveEditorMinWidth should set this.editorMinWidth to correct value', () => {
        const EDITOR_MIN_WIDTH_FAKE_VALUE = 100;
        component.saveEditorMinWidth(EDITOR_MIN_WIDTH_FAKE_VALUE);
        expect(component.editorMinWidth).toEqual(EDITOR_MIN_WIDTH_FAKE_VALUE);
    });

    it("#setEditorMinWidth should set editor's css min-width to correct value ", () => {
        const EDITOR_MIN_WIDTH_FAKE_VALUE = 100;
        component.editorMinWidth = EDITOR_MIN_WIDTH_FAKE_VALUE;
        component.setEditorMinWidth();
        const editorMinWidthString = component.editor.nativeElement.style.minWidth;
        const editorMinWidth = parseInt(editorMinWidthString, 10);
        expect(editorMinWidth).toEqual(EDITOR_MIN_WIDTH_FAKE_VALUE);
    });
});
