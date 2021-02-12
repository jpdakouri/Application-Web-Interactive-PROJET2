import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { ColourHistoryComponent } from '@app/components/colour-components/colour-history/colour-history.component';
import { ColourPaletteSelectorComponent } from '@app/components/colour-components/colour-palette-selector/colour-palette-selector.component';
import { ColourSelectorComponent } from '@app/components/colour-components/colour-selector/colour-selector.component';
import { CurrentColourComponent } from '@app/components/colour-components/current-color/current-colour.component';
import { HueSelectorComponent } from '@app/components/colour-components/hue-selector/hue-selector.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/toolbar-components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar-components/toolbar/toolbar.component';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/tests-mocks/tool-manager-mock';
import { KeyboardButton } from '@app/utils/enums/list-boutton-pressed';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolManagerServiceMock: ToolManagerServiceMock;
    // tslint:disable-next-line:prefer-const
    // let emitterSpy: jasmine.SpyObj<ToolManagerServiceMock>;

    beforeEach(async(() => {
        toolManagerServiceMock = new ToolManagerServiceMock();
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                DrawingComponent,
                ToolAttributeBarComponent,
                ToolbarComponent,
                ColourSelectorComponent,
                ColourPaletteSelectorComponent,
                ColourHistoryComponent,
                CurrentColourComponent,
                HueSelectorComponent,
            ],
            imports: [MatSliderModule, MatDividerModule, MatButtonModule, MatIconModule, FormsModule],
            providers: [{ provide: ToolManagerService, useValue: toolManagerServiceMock }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // tslint:disable:no-any
        spyOn<any>(toolManagerServiceMock, 'emitToolChange').and.callThrough();
    });

    it('should create', () => {
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

    it(' #onKeyUp should call set the right tool if input is valide ', () => {
        const goodInput = { key: KeyboardButton.Rectangle } as KeyboardEvent;
        component.onKeyUp(goodInput);
        expect(toolManagerServiceMock.emitToolChange).toHaveBeenCalled();
    });

    it(' onKeyUp should not call emitToolChange if shift is pressed or the key is inalid ', () => {
        component.onKeyUp({ shiftKey: true } as KeyboardEvent);
        expect(toolManagerServiceMock.emitToolChange).not.toHaveBeenCalled();

        const badInput = { key: KeyboardButton.InvalidInput } as KeyboardEvent;
        component.onKeyUp(badInput);
        expect(toolManagerServiceMock.emitToolChange).not.toHaveBeenCalled();
    });
});
