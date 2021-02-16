import { TestBed } from '@angular/core/testing';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';

describe('AerosolService', () => {
    let service: AerosolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AerosolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
