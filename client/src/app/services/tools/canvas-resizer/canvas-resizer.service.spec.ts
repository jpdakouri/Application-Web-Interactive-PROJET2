import { TestBed } from '@angular/core/testing';

import { CanvasResizerService, Status } from './canvas-resizer.service';

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should  change status when #onMiddleRightResizerClicked called', () => {
        service.onMiddleRightResizerClick();
        expect(service.status).toBe(Status.MIDDLE_RIGHT_RESIZE);
    });
});
