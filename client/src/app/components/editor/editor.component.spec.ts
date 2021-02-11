import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar/toolbar.component';
import { KeyboardButton } from '@app/list-boutton-pressed';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { EditorComponent } from './editor.component';

fdescribe('EditorComponent', () => {
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

    fit(' #onKeyUp should call set the right tool if input is valide ', () => {
        const goodInput = { key: KeyboardButton.Rectangle } as KeyboardEvent;
        // const badInput = { key: KeyboardButton.RandomKey } as KeyboardEvent;
        const toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService> = jasmine.createSpyObj('ToolManagerService', [
            'setCurrentTool',
            'emitToolChange',
        ]);
        spyOn(component, 'onKeyUp');
        component.onKeyUp(goodInput);
        expect(toolManagerServiceSpy.emitToolChange).toHaveBeenCalled();
    });
});
