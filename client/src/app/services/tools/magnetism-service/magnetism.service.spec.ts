import { TestBed } from '@angular/core/testing';
import { MagnetismService } from './magnetism.service';

describe('MagnetismServiceService', () => {
    let service: MagnetismService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
