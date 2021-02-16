import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColourHistoryComponent } from '@app/components/colour-components/colour-history/colour-history.component';
import { ColourPaletteSelectorComponent } from '@app/components/colour-components/colour-palette-selector/colour-palette-selector.component';
import { CurrentColourComponent } from '@app/components/colour-components/current-color/current-colour.component';
import { HueSelectorComponent } from '@app/components/colour-components/hue-selector/hue-selector.component';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { ColourSelectorComponent } from './colour-selector.component';
describe('ColourSelectorComponent', () => {
    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ColourSelectorComponent,
                ColourHistoryComponent,
                ColourPaletteSelectorComponent,
                CurrentColourComponent,
                HueSelectorComponent,
            ],
            imports: [MatIconModule, BrowserAnimationsModule, MatInputModule, MatDividerModule, FormsModule],
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
    it('isValidTransparency returns true for valid transparencies', () => {
        expect(component.isValidTransparency('0')).toBe(true);
        expect(component.isValidTransparency('100')).toBe(true);
    });
    it('isValidTransparency returns false for invalid transparencies', () => {
        expect(component.isValidTransparency('-1')).toBe(false);
        expect(component.isValidTransparency('')).toBe(false);
        expect(component.isValidTransparency('101')).toBe(false);
        expect(component.isValidTransparency('1a')).toBe(false);
        expect(component.isValidTransparency('1.1')).toBe(false);
    });
    it('isValidRGB returns true for valid RGB', () => {
        component.rgbColor = '0,0,0';
        expect(component.isValidRGB()).toBe(true);
        component.rgbColor = 'FF,ff,FF';
        expect(component.isValidRGB()).toBe(true);
    });
    it('isValidRGB returns false for invalid RGB', () => {
        component.rgbColor = '';
        expect(component.isValidRGB()).toBe(false);
        component.rgbColor = '0,0';
        expect(component.isValidRGB()).toBe(false);
        component.rgbColor = '0,0,0,0';
        expect(component.isValidRGB()).toBe(false);
        component.rgbColor = '0,,0';
        expect(component.isValidRGB()).toBe(false);
        component.rgbColor = '-1,0,0';
        expect(component.isValidRGB()).toBe(false);
        component.rgbColor = '0, 0, 0';
        expect(component.isValidRGB()).toBe(false);
    });

    it('if the transparencies that the user enters are valid, then the set functions of the currentcolorservice are called', () => {
        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setPrimaryColorTransparency');
        spyOn(currentColorService, 'setSecondaryColorTransparency');
        component.primaryColourTransparency = '0';
        component.secondaryColourTransparency = '100';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalled();
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalled();
    });
    it('if the transparencies that the user enters are invalid, then the set functions of the currentcolorservice are not called', () => {
        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setPrimaryColorTransparency');
        spyOn(currentColorService, 'setSecondaryColorTransparency');
        component.primaryColourTransparency = '-1';
        component.secondaryColourTransparency = '101';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        component.secondaryColourTransparency = '1.1';
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalledTimes(0);
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalledTimes(0);
    });
    it('setPrimaryColor calls the set method of CurrentColourService and empties the RGB field', () => {
        component.rgbColor = '00,00,00';
        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        component.setPrimaryColor();
        expect(component.rgbColor).toBe('');
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('0,0,0');
    });
    it('setSecondaryColor calls the set method of CurrentColourService and empties the RGB field', () => {
        component.rgbColor = 'ff,ff,ff';
        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setSecondaryColorRgb');
        component.setSecondaryColor();
        expect(component.rgbColor).toBe('');
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });
});
