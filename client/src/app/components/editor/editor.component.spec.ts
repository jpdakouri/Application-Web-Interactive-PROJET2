import { HttpClientModule } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Vec2 } from '@app/classes/vec2';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { ColorHistoryComponent } from '@app/components/color-components/color-history/color-history.component';
import { ColorPaletteSelectorComponent } from '@app/components/color-components/color-palette-selector/color-palette-selector.component';
import { ColorSelectorComponent } from '@app/components/color-components/color-selector/color-selector.component';
import { CurrentColorComponent } from '@app/components/color-components/current-color/current-color.component';
import { HueSelectorComponent } from '@app/components/color-components/hue-selector/hue-selector.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { PipettePreviewComponent } from '@app/components/pipette-preview/pipette-preview.component';
import { ToolAttributeComponent } from '@app/components/toolbar-components/tool-attribute/tool-attribute.component';
import { ToolbarComponent } from '@app/components/toolbar-components/toolbar/toolbar.component';
import { ClipboardService } from '@app/services/clipboard-service/clipboard.service';
import { DialogControllerService } from '@app/services/dialog-controller/dialog-controller.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolManagerServiceMock } from '@app/utils/tests-mocks/tool-manager-mock';
import { EditorComponent } from './editor.component';

class DrawingServiceMock {
    // tslint:disable:no-empty
    newDrawing: EventEmitter<Vec2> = new EventEmitter<Vec2>();
    createNewDrawingEmitter: EventEmitter<boolean> = new EventEmitter();

    saveCanvas(): void {}

    restoreCanvas(): void {}

    clearCanvas(): void {}

    isCanvasBlank(): boolean {
        return true;
    }

    createNewDrawing(): void {}

    openDrawing(): void {}
}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolManagerServiceMock: ToolManagerServiceMock;
    let drawingServiceSpy: DrawingServiceMock;

    beforeEach(async(() => {
        drawingServiceSpy = new DrawingServiceMock();
        toolManagerServiceMock = new ToolManagerServiceMock();
        toolManagerServiceMock.textService.showTextBox = false;
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                DrawingComponent,
                ToolAttributeComponent,
                ToolbarComponent,
                ColorSelectorComponent,
                ColorPaletteSelectorComponent,
                ColorHistoryComponent,
                CurrentColorComponent,
                HueSelectorComponent,
                ExportDrawingComponent,
                PipettePreviewComponent,
            ],
            imports: [
                MatCheckboxModule,
                MatButtonToggleModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatSliderModule,
                MatDividerModule,
                MatButtonModule,
                MatIconModule,
                FormsModule,
                MatTooltipModule,
                HttpClientModule,
                MatDialogModule,
                MatChipsModule,
                MatOptionModule,
                MatSelectModule,
            ],
            providers: [
                { provide: ToolManagerService, useValue: toolManagerServiceMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: CarouselComponent, useValue: {} },
            ],
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

    it(' #onKeyDown should call set the right tool if input is valid', () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Pencil });
        component.onKeyDown(keyBordPrevent);
        expect(toolManagerServiceMock.emitToolChange).toHaveBeenCalled();
    });

    it(' onKeyDown should not call emitToolChange if shift is pressed or the key is inalid ', () => {
        let keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { shiftKey: true });
        component.onKeyDown(keyBordPrevent);
        expect(toolManagerServiceMock.emitToolChange).not.toHaveBeenCalled();

        keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.InvalidInput });
        component.onKeyDown(keyBordPrevent);
        expect(toolManagerServiceMock.emitToolChange).not.toHaveBeenCalled();
    });

    it(' #onKeyDown should not call create new drawing if input is invalid ', () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.NewDrawing, ctrlKey: false });
        spyOn(drawingServiceSpy, 'createNewDrawing').and.stub();
        component.onKeyDown(keyBordPrevent);
        expect(drawingServiceSpy.createNewDrawing).not.toHaveBeenCalled();
    });

    it(' #onKeyDown should call create new drawing if input is valid, and if successful, saves initial state ', () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.NewDrawing, ctrlKey: true });
        const creatNewDrawing = spyOn(component, 'onCreateNewDrawing').and.stub().and.returnValue(true);
        spyOn(TestBed.inject(UndoRedoService), 'saveInitialState');
        component.onKeyDown(keyBordPrevent);
        expect(creatNewDrawing).toHaveBeenCalled();
        expect(TestBed.inject(UndoRedoService).saveInitialState).toHaveBeenCalled();
    });

    it(' #onKeyDown should call create new drawing if input is valid, and if unsuccessful, does not save initial state ', () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.NewDrawing, ctrlKey: true });
        const creatNewDrawing = spyOn(component, 'onCreateNewDrawing').and.stub().and.returnValue(false);
        spyOn(TestBed.inject(UndoRedoService), 'saveInitialState');
        component.onKeyDown(keyBordPrevent);
        expect(creatNewDrawing).toHaveBeenCalled();
        expect(TestBed.inject(UndoRedoService).saveInitialState).not.toHaveBeenCalled();
    });

    it(' #onKeyDown should call openSaveDrawingModal if input is valid ', () => {
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Save, ctrlKey: true });
        spyOn(component, 'openSaveDrawingModal').and.stub();
        component.onKeyDown(event);
        expect(component.openSaveDrawingModal).toHaveBeenCalled();
    });

    it(' #onKeyDown should call selectAll if input is valid ', () => {
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.SelectAll, ctrlKey: true });
        spyOn(component, 'selectAll').and.stub();
        component.onKeyDown(event);
        expect(component.selectAll).toHaveBeenCalled();
    });

    it(' #onKeyDown should call openExportDrawingModal if input is valid ', () => {
        const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Export, ctrlKey: true });
        spyOn(component, 'openExportDrawingModal').and.stub();
        component.onKeyDown(event);
        expect(component.openExportDrawingModal).toHaveBeenCalled();
    });

    it(' #onKeyDown should call openCarouselModal if input is valid ', () => {
        spyOn(component, 'openCarouselModal').and.stub();
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Carousel, ctrlKey: true });
        component.onKeyDown(keyBordPrevent);
        expect(component.openCarouselModal).toHaveBeenCalled();
    });

    it(" #onKeyDown shouldn'n call openSaveDrawingModal if a dialog is open ", () => {
        const keyBordPrevent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], { key: KeyboardButtons.Save, ctrlKey: true });
        // tslint:disable-next-line:no-string-literal
        component['dialogControllerService'].noDialogOpened = false;
        spyOn(component, 'openSaveDrawingModal').and.stub();
        spyOn(component, 'openCarouselModal').and.stub();
        component.onKeyDown(keyBordPrevent);
        expect(component.openSaveDrawingModal).not.toHaveBeenCalled();
    });

    it('should create new drawing when new drawing button is clicked', () => {
        const creatNewDrawing = spyOn(drawingServiceSpy, 'createNewDrawing').and.callThrough();
        component.onCreateNewDrawing();
        expect(creatNewDrawing).toHaveBeenCalled();
    });

    it('openDialog should be called with save when openSaveDrawingModal is called', () => {
        // tslint:disable:no-string-literal
        spyOn(component['dialogControllerService'], 'openDialog').and.stub();
        component.openSaveDrawingModal();
        expect(component['dialogControllerService'].openDialog).toHaveBeenCalledWith('save');
    });

    it('openDialog should be called with export when onExportDrawing is called', () => {
        spyOn(component['dialogControllerService'], 'openDialog').and.stub();
        component.onExportDrawing();
        expect(component['dialogControllerService'].openDialog).toHaveBeenCalledWith('export');
    });

    it('openDialog should be called with carousel when openCarouselModal is called', () => {
        spyOn(component['dialogControllerService'], 'openDialog').and.stub();
        component.openCarouselModal();
        expect(component['dialogControllerService'].openDialog).toHaveBeenCalledWith('carousel');
    });

    it('selectAll from selectionEllipseService should be called with carousel when selectAll is called', () => {
        spyOn(component['selectionRectangleService'], 'selectAll').and.stub();
        component.selectAll();
        expect(component['selectionRectangleService'].selectAll).toHaveBeenCalled();
    });
    it('should undo if ctrl + z is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
        spyOn(TestBed.inject(UndoRedoService), 'undo');
        component.onKeyDown(event);
        expect(TestBed.inject(UndoRedoService).undo).toHaveBeenCalled();
    });
    it('should redo if ctrl + shift + z is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'Z', ctrlKey: true });
        spyOn(TestBed.inject(UndoRedoService), 'redo');
        component.onKeyDown(event);
        expect(TestBed.inject(UndoRedoService).redo).toHaveBeenCalled();
    });

    it('should copy if ctrl + c is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
        spyOn(TestBed.inject(ClipboardService), 'copy');
        component.onKeyDown(event);
        expect(TestBed.inject(ClipboardService).copy).toHaveBeenCalled();
    });

    it('should paste if ctrl + v is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
        spyOn(TestBed.inject(ClipboardService), 'paste');
        component.onKeyDown(event);
        expect(TestBed.inject(ClipboardService).paste).toHaveBeenCalled();
    });

    it('should cut if ctrl + x is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true });
        spyOn(TestBed.inject(ClipboardService), 'cut');
        component.onKeyDown(event);
        expect(TestBed.inject(ClipboardService).cut).toHaveBeenCalled();
    });
    it('should delete if delete is pressed', () => {
        TestBed.inject(DialogControllerService).noDialogOpened = true;
        const event = new KeyboardEvent('keydown', { key: 'Delete' });
        spyOn(TestBed.inject(ClipboardService), 'delete');
        component.onKeyDown(event);
        expect(TestBed.inject(ClipboardService).delete).toHaveBeenCalled();
    });
});
