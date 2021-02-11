import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar/toolbar.component';
import { KeyboardButton } from '@app/list-boutton-pressed';
import { ToolManagerServiceMock } from '@app/tests-mocks/tool-manager-mock';
import { EditorComponent } from './editor.component';

fdescribe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolManagerServiceMock: ToolManagerServiceMock;

    beforeEach(async(() => {
        toolManagerServiceMock = new ToolManagerServiceMock();
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, ToolAttributeBarComponent, ToolbarComponent],
            providers: [{ provide: ToolManagerServiceMock, useValue: toolManagerServiceMock }],
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

    fit(' #onKeyUp should call set the right tool if input is valide ', () => {
        const event = { key: KeyboardButton.InvalidInput } as KeyboardEvent;
        const emitterSpy = spyOn(toolManagerServiceMock, 'emitToolChange').and.callThrough();
        component.onKeyUp(event);
        expect(emitterSpy).toHaveBeenCalled();
    });
});
