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
    /* 
    it('the selector does not move if not clicked', () => {
            component.ngAfterViewInit()
        expect(false).toBeTruthy();
    });

    it('the color is correctly emitted', () => {
        component.ngAfterViewInit()
        expect(false).toBeTruthy();
    });

    it('the color is not emitted if the cursor is not at a valid position', () => {
        component.ngAfterViewInit()
        expect(false).toBeTruthy();
    }); */
});
