import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { ColourHistoryComponent } from '@app/components/colour-components/colour-history/colour-history.component';
import { ColourPaletteSelectorComponent } from '@app/components/colour-components/colour-palette-selector/colour-palette-selector.component';
import { CurrentColourComponent } from '@app/components/colour-components/current-color/current-colour.component';
import { HueSelectorComponent } from '@app/components/colour-components/hue-selector/hue-selector.component';
import { ColourSelectorComponent } from './colour-selector.component';

describe('ColourSelectorComponent', () => {
    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ColourSelectorComponent,
                HueSelectorComponent,
                ColourPaletteSelectorComponent,
                ColourHistoryComponent,
                CurrentColourComponent,
            ],
            imports: [MatDividerModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
