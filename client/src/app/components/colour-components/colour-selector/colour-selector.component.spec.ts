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
import SpyObj = jasmine.SpyObj;
describe('ColourSelectorComponent', () => {
    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;
    let currentColourServiceSpy: SpyObj<CurrentColourService>;

    beforeEach(async(() => {
        currentColourServiceSpy = jasmine.createSpyObj('CurrentColorService', [
            'setPrimaryColorTransparency',
            'setSecondaryColorTransparency',
            'getPrimaryColorRgb',
            'getSecondaryColorRgb',
        ]);

        TestBed.configureTestingModule({
            declarations: [
                ColourSelectorComponent,
                ColourHistoryComponent,
                ColourPaletteSelectorComponent,
                CurrentColourComponent,
                HueSelectorComponent,
            ],
            providers: [{ provide: CurrentColourService, useValue: currentColourServiceSpy }],
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
        component.primaryColourTransparency = '0';
        component.secondaryColourTransparency = '100';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColourServiceSpy.setPrimaryColorTransparency).toHaveBeenCalled();
        expect(currentColourServiceSpy.setSecondaryColorTransparency).toHaveBeenCalled();
    });
    it('if the transparencies that the user enters are invalid, then the set functions of the currentcolorservice are not called', () => {
        component.primaryColourTransparency = '-1';
        component.secondaryColourTransparency = '101';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        component.secondaryColourTransparency = '1.1';
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColourServiceSpy.setPrimaryColorTransparency).toHaveBeenCalledTimes(0);
        expect(currentColourServiceSpy.setSecondaryColorTransparency).toHaveBeenCalledTimes(0);
    });
});
