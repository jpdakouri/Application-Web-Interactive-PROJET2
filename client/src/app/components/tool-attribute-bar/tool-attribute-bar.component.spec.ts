import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolManagerServiceMock } from '@app/tests-mocks/tool-manager-mock';
import { ToolAttributeBarComponent } from './tool-attribute-bar.component';

describe('ToolAttributeBarComponent', () => {
    let component: ToolAttributeBarComponent;
    let fixture: ComponentFixture<ToolAttributeBarComponent>;
    let toolManagerServiceMock: ToolManagerServiceMock;

    beforeEach(async(() => {
        toolManagerServiceMock = new ToolManagerServiceMock();
        TestBed.configureTestingModule({
            declarations: [ToolAttributeBarComponent],
            providers: [{ provide: ToolManagerService, useValue: toolManagerServiceMock }],
            imports: [MatButtonToggleModule, MatSliderModule, MatDividerModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolAttributeBarComponent);
        component = fixture.componentInstance;
        spyOn(component, 'showLineWidth').and.returnValue(true);
        spyOn(component, 'showEllipseTitle').and.returnValue(true);
        spyOn(component, 'showShapeStyle').and.returnValue(true);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
