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

    it('should  change status when #onMiddleBottomResizerClick called', () => {
        service.onMiddleBottomResizerClick();
        expect(service.status).toBe(Status.MIDDLE_BOTTOM_RESIZE);
    });

    it('should  change status when #onBottomRightResizerClick called', () => {
        service.onBottomRightResizerClick();
        expect(service.status).toBe(Status.BOTTOM_RIGHT_RESIZE);
    });
});
