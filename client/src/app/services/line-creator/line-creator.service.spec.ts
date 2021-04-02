import { TestBed } from '@angular/core/testing';
import { LineCreatorService } from './line-creator.service';

describe('LineCreatorService', () => {
    let service: LineCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
