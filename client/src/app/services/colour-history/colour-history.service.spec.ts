import { TestBed } from '@angular/core/testing';
import { ColourHistoryService, HISTORY_LENGTH } from './colour-history.service';

const DEFAULT_COLOUR = 'rgba(255,255,255,1)';
describe('ColourHistoryService', () => {
    let service: ColourHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColourHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('upon creation, the history is filled with 10x white', () => {
        let colouredPassed = 0;
        for (let i = 0; i < HISTORY_LENGTH; i++) {
            if (service.getColour(i) === DEFAULT_COLOUR) colouredPassed++;
        }
        expect(colouredPassed).toBe(HISTORY_LENGTH);
    });

    it('pushColour adds the new color to the front', () => {
        const NEW_COLOUR = 'rgba(0,0,0,1)';
        service.pushColour(NEW_COLOUR);
        expect(service.getColour(0)).toBe(NEW_COLOUR);
    });

    it('pushColour adds the new color to the front', () => {
        const NEW_COLOUR = 'rgba(0,0,0,1)';
        service.pushColour(NEW_COLOUR);
        expect(service.getColour(0)).toBe(NEW_COLOUR);
    });

    it('selectColour puts the selected color at the front and returns it', () => {
        const WANTED_COLOUR = 'rgba(0,0,0,1)';
        const UNWANTED_COLOUR = 'rgba(1,1,1,1)';
        service.pushColour(WANTED_COLOUR);
        service.pushColour(UNWANTED_COLOUR);
        const SELECTED_COLOUR = service.selectColour(1);
        expect(SELECTED_COLOUR).toBe(WANTED_COLOUR);
        expect(service.getColour(0)).toBe(WANTED_COLOUR);
        expect(service.getColour(1)).toBe(UNWANTED_COLOUR);
    });
});
