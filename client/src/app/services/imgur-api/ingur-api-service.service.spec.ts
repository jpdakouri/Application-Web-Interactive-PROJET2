import { TestBed } from '@angular/core/testing';

import { ImgurApiServiceService } from './imgur-api-service.service';

describe('IngurApiServiceService', () => {
    let service: ImgurApiServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ImgurApiServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
