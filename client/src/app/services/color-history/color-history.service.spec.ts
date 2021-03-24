import { TestBed } from '@angular/core/testing';
import { DEFAULT_COLOR } from '@app/utils/enums/rgb-settings.ts';
import { ColorHistoryService, HISTORY_LENGTH } from './color-history.service';

describe('ColorHistoryService', () => {
    let service: ColorHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('upon creation, the history is filled with 10x white', () => {
        let coloredPassed = 0;
        for (let i = 0; i < HISTORY_LENGTH; i++) {
            if (service.getColor(i) === DEFAULT_COLOR) coloredPassed++;
        }
        expect(coloredPassed).toBe(HISTORY_LENGTH);
    });

    it('pushColor adds the new color to the front', () => {
        const newColor = 'rgb(0,0,0)';
        service.pushColor(newColor);
        expect(service.getColor(0)).toBe(newColor);
    });

    it('getColors returns empty string for an invalid index', () => {
        const invalidIndex = -1;
        expect(service.getColor(invalidIndex)).toBe('');
    });
});
