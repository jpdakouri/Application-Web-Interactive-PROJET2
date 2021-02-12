import { ColourHistoryService } from '@app/services/colour-history/colour-history.service';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

import { ColourSelectorComponent } from './colour-selector.component';

describe('ColourSelectorComponent', () => {
    let currentColorService: CurrentColourService;
    let component: ColourSelectorComponent;

    beforeEach(() => {
        currentColorService = new CurrentColourService(new ColourHistoryService());
        component = new ColourSelectorComponent(currentColorService);
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
        component.primaryColourTransparency = '0.1';
        component.secondaryColourTransparency = '1';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalled();
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalled();
    });
    it('if the transparencies that the user enters are invalid, then the set functions of the currentcolorservice are not called', () => {
        component.primaryColourTransparency = '-1';
        component.secondaryColourTransparency = '101';
        component.onPrimaryColorTransparencyEntryChange();
        component.onSecondaryColorTransparencyEntryChange();
        expect(currentColorService.setPrimaryColorTransparency).toHaveBeenCalledTimes(0);
        expect(currentColorService.setSecondaryColorTransparency).toHaveBeenCalledTimes(0);
    });
});
