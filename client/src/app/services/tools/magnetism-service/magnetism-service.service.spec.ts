import { TestBed } from '@angular/core/testing';
import { MagnetismServiceService } from './magnetism-service.service';

describe('MagnetismServiceService', () => {
    let service: MagnetismServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
