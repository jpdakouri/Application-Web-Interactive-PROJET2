import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorHistoryComponent } from '@app/components/color-components/color-history/color-history.component';
import { ColorPaletteSelectorComponent } from '@app/components/color-components/color-palette-selector/color-palette-selector.component';
import { CurrentColorComponent } from '@app/components/color-components/current-color/current-color.component';
import { HueSelectorComponent } from '@app/components/color-components/hue-selector/hue-selector.component';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { ColorSelectorComponent } from './color-selector.component';
describe('ColorSelectorComponent', () => {
    let component: ColorSelectorComponent;
    let fixture: ComponentFixture<ColorSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ColorSelectorComponent,
                ColorHistoryComponent,
                ColorPaletteSelectorComponent,
                CurrentColorComponent,
                HueSelectorComponent,
            ],
            imports: [MatIconModule, BrowserAnimationsModule, MatInputModule, MatDividerModule, FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('isValidTransparency returns true for valid transparencies', () => {
        expect(component.isValidTransparency('1')).toBe(true);
        expect(component.isValidTransparency('100')).toBe(true);
    });
    it('isValidTransparency returns false for invalid transparencies', () => {
        expect(component.isValidTransparency('-1')).toBe(false);
        expect(component.isValidTransparency('0')).toBe(false);
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
        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setPrimaryColorTransparency');
        spyOn(currentColorService, 'setSecondaryColorTransparency');
        component.primaryColorTransparency = '1';
        component.secondaryColorTransparency = '100';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalled();
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalled();
    });
    it('if the transparencies that the user enters are invalid, then the set functions of the currentcolorservice are not called', () => {
        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setPrimaryColorTransparency');
        spyOn(currentColorService, 'setSecondaryColorTransparency');
        component.primaryColorTransparency = '-1';
        component.secondaryColorTransparency = '101';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        component.secondaryColorTransparency = '1.1';
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalledTimes(0);
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalledTimes(0);
    });
    it('setPrimaryColor calls the set method of CurrentColorService and empties the RGB field', () => {
        component.rgbColor = '00,00,00';
        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        component.setPrimaryColor();
        expect(component.rgbColor).toBe('');
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('0,0,0');
    });
    it('setSecondaryColor calls the set method of CurrentColorService and empties the RGB field', () => {
        component.rgbColor = 'ff,ff,ff';
        const currentColorService = TestBed.inject(CurrentColorService);
        spyOn(currentColorService, 'setSecondaryColorRgb');
        component.setSecondaryColor();
        expect(component.rgbColor).toBe('');
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });
});
