import { TestBed } from '@angular/core/testing';

import { CanvasResizerService } from './canvas-resizer.service';

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
