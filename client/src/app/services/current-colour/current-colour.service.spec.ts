import { TestBed } from '@angular/core/testing';

import { CurrentColourService } from './current-colour.service';
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('CurrentColourService', () => {
    let service: CurrentColourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CurrentColourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getPrimaryColorHex et getSecondaryColorHex should return an hexadecimal equivalent of an rgb color ', () => {
        service['primaryColorRgb'] = '133,212,234';
        service['secondaryColorRgb'] = '233,044,21';

        // online result of the conversion
        const expectedPrimaryValue = '#85d4ea';
        const expectedSecondaryValue = '#e92c15';

        expect(service.getPrimaryColorHex()).toEqual(expectedPrimaryValue);
        expect(service.getSecondaryColorHex()).toEqual(expectedSecondaryValue);
    });
});
