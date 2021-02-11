import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ToolAttributeBarComponent } from '@app/components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from '@app/components/toolbar/toolbar.component';
import { KeyboardButton } from '@app/list-boutton-pressed';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/tests-mocks/tool-manager-mock';
import { EditorComponent } from './editor.component';

fdescribe('EditorComponent', () => {
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
    });

    it('should create', () => {
        console.log(component);
        expect(component).toBeTruthy();
    });

    fit(' #onKeyUp should call set the right tool if input is valide ', () => {
        // tslint:disable:no-any
        const teset = spyOn<any>(ToolManagerServiceMock, 'emitToolChange').and.callThrough();
        console.log(teset);

        component.onKeyUp({ key: KeyboardButton.Line } as KeyboardEvent);
        expect(teset).toHaveBeenCalled();
    });
});
