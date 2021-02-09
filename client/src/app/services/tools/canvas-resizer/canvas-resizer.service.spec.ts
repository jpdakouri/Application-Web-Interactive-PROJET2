import { TestBed } from '@angular/core/testing';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;
    let mouseEvent: MouseEvent;
    let mouseServiceSpy: MouseHandlerService;

    beforeEach(() => {
        mouseServiceSpy = jasmine.createSpyObj('MouseHandlerService', [
            'onMouseDown',
            'onMouseMove',
            'onMouseUp',
            'onMouseLeave',
            'eventToCoordinate',
        ]);
        TestBed.configureTestingModule({
            providers: [{ provide: MouseHandlerService, useValue: mouseServiceSpy }],
        });
        service = TestBed.inject(CanvasResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("should call MouseHandlerService's #onMouseDown on mousedown", () => {
        mouseEvent = {} as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(mouseServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it("should call MouseHandlerService's #onMousemove on mousemove", () => {
        mouseEvent = {} as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(mouseServiceSpy.onMouseMove).toHaveBeenCalled();
    });

    it("should call MouseHandlerService's #onMouseLeave on mouseup", () => {
        mouseEvent = {} as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(mouseServiceSpy.onMouseUp).toHaveBeenCalled();
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
