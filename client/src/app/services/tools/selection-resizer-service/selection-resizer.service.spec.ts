import { TestBed } from '@angular/core/testing';

import { SelectionResizerService } from './selection-resizer.service';

describe('SelectionResizerService', () => {
    let service: SelectionResizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
