import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolAttributeBarComponent } from './tool-attribute-bar.component';

describe('ToolAttributeBarComponent', () => {
    let component: ToolAttributeBarComponent;
    let fixture: ComponentFixture<ToolAttributeBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolAttributeBarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolAttributeBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
