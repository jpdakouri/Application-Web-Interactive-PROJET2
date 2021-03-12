import { TestBed } from '@angular/core/testing';
import { DEFAULT_COLOUR } from '@app/utils/enums/rgb-settings.ts';
import { ColourHistoryService, HISTORY_LENGTH } from './colour-history.service';

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
        const newColor = 'rgb(0,0,0)';
        service.pushColour(newColor);
        expect(service.getColour(0)).toBe(newColor);
    });

    it('getColors returns empty string for an invalid index', () => {
        const invalidIndex = -1;
        expect(service.getColour(invalidIndex)).toBe('');
    });
});
