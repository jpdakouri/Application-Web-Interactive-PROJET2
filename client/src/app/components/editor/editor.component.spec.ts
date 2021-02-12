import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar/toolbar.component';
import { KeyboardButton } from '@app/list-boutton-pressed';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/tests-mocks/tool-manager-mock';
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
            declarations: [EditorComponent, DrawingComponent, ToolAttributeBarComponent, ToolbarComponent],
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
        console.log(component);
        expect(component).toBeTruthy();
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
