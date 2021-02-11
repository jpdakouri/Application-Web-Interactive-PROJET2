import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourHistoryComponent } from './colour-history.component';

describe('ColourHistoryComponent', () => {
    let component: ColourHistoryComponent;
    let fixture: ComponentFixture<ColourHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourHistoryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
