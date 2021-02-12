import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HueSelectorComponent } from './hue-selector.component';

describe('HueSelectorComponent', () => {
    let component: HueSelectorComponent;
    let fixture: ComponentFixture<HueSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HueSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HueSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('the gradient is drawn correctly', () => {
        component.ngAfterViewInit();
        expect(false).toBeTruthy();
    });
    it('the selector does not move if not clicked', () => {
        expect(false).toBeTruthy();
    });

    it('the color is emitted if the cursor is on the component canvas', () => {
        component.ngAfterViewInit()
        expect(false).toBeTruthy();
    });

    it('the color is not emitted if the cursor is not at a valid position', () => {
        component.ngAfterViewInit()
        expect(false).toBeTruthy();
    });
});
