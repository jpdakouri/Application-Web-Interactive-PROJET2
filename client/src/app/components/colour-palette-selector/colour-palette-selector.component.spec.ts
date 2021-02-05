import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourPaletteSelectorComponent } from './colour-palette-selector.component';

describe('ColourPaletteSelectorComponent', () => {
    let component: ColourPaletteSelectorComponent;
    let fixture: ComponentFixture<ColourPaletteSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourPaletteSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
