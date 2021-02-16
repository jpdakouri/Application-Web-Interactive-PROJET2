import { ColourHistoryService } from '@app/services/colour-history/colour-history.service';
import { CurrentColourService } from './current-colour.service';

describe('CurrentColourService', () => {
    let service: CurrentColourService;

    let colourHistory: jasmine.SpyObj<ColourHistoryService>;

    beforeEach(() => {
        colourHistory = jasmine.createSpyObj('ColourHistoryService', ['pushColour']);
        service = new CurrentColourService(colourHistory);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('RGB setters and getters work properly when a different color is trying to be set', () => {
        const newPrimaryColor = '1,1,1';
        const newSecondaryColor = '2,2,2';
        service.setPrimaryColorRgb(newPrimaryColor);
        service.setSecondaryColorRgb(newSecondaryColor);
        expect(service.getPrimaryColorRgb()).toBe('rgb(1,1,1)');
        expect(service.getSecondaryColorRgb()).toBe('rgb(2,2,2)');
        expect(colourHistory.pushColour).toHaveBeenCalledTimes(2);
    });

    it("RGB setters and getters don't try to set the color if it's the same", () => {
        const newPrimaryColor = '0,0,0';
        const newSecondaryColor = '255,255,255';
        service.setPrimaryColorRgb(newPrimaryColor);
        service.setSecondaryColorRgb(newSecondaryColor);
        expect(colourHistory.pushColour).toHaveBeenCalledTimes(0);
    });

    it('RGBA setters and getters work properly', () => {
        const newPrimaryTransparency = '0.5';
        const newSecondaryTransparency = '0.3';
        service.setPrimaryColorTransparency(newPrimaryTransparency);
        service.setSecondaryColorTransparency(newSecondaryTransparency);
        expect(service.getPrimaryColorRgba()).toBe('rgba(0,0,0,0.5)');
        expect(service.getSecondaryColorRgba()).toBe('rgba(255,255,255,0.3)');
        expect(colourHistory.pushColour).toHaveBeenCalledTimes(0);
    });

    it('swapColors only swaps RGB colors', () => {
        const newPrimaryTransparency = '0.5';
        const newSecondaryTransparency = '0.3';
        service.setPrimaryColorTransparency(newPrimaryTransparency);
        service.setSecondaryColorTransparency(newSecondaryTransparency);
        service.swapColors();
        expect(service.getPrimaryColorRgba()).toBe('rgba(255,255,255,0.5)');
        expect(service.getSecondaryColorRgba()).toBe('rgba(0,0,0,0.3)');
        expect(colourHistory.pushColour).toHaveBeenCalledTimes(0);
    });
});
