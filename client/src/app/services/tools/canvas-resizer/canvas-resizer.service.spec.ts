import { TestBed } from '@angular/core/testing';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;
    let mouseEvent: MouseEvent;
    let mouseServiceSpy: MouseHandlerService;

    beforeEach(() => {
        mouseServiceSpy = jasmine.createSpyObj('MouseHandlerService', ['onMouseDown', 'eventToCoordinate']);
        TestBed.configureTestingModule({
            providers: [{ provide: MouseHandlerService, useValue: mouseServiceSpy }],
        });
        service = TestBed.inject(CanvasResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call MouseHandlerService #onMouseDown', () => {
        // spyOn(mouseServiceSpy, 'onMouseDown');
        mouseEvent = {} as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(mouseServiceSpy.onMouseDown).toHaveBeenCalled();
        // expect(mouseServiceSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
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
