import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';
//
class MockMouseService extends MouseHandlerService {
    startCoordinate: Coordinate = { x: 965, y: 400 };
    endCoordinate: Coordinate = { x: 456, y: 236 };

    // tslint:disable-next-line:no-magic-numbers
    calculateDeltaX = (): number => 795;
    // tslint:disable-next-line:no-magic-numbers
    calculateDeltaY = (): number => 100;
    onMouseDown(event: MouseEvent): void {
        return;
    }
    onMouseUp(event: MouseEvent): void {
        return;
    }
    onMouseMove(event: MouseEvent): void {
        return;
    }
}

// tslint:disable:no-any
fdescribe('CanvasResizerService', () => {
    let mouseMock: MockMouseService;
    let service: CanvasResizerService;
    let mouseEvent: MouseEvent;
    // let mouseServiceSpy: jasmine.SpyObj<MouseHandlerService>;

    beforeEach(() => {
        mouseMock = new MockMouseService();
        // tslint:disable-next-line:max-line-length
        // mouseServiceSpy = jasmine.createSpyObj('MockMouseService', ['onMouseDown', 'onMouseMove', 'onMouseUp', 'onMouseLeave', 'eventToCoordinate']);
        TestBed.configureTestingModule({
            providers: [{ provide: MouseHandlerService, useValue: mouseMock }],
        });
        service = TestBed.inject(CanvasResizerService);
        // mouseServiceSpy = TestBed.inject(MockMouseService) as jasmine.SpyObj<MouseHandlerService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("should call MouseHandlerService's #onMouseDown on mousedown", () => {
        mouseEvent = {} as MouseEvent;
        spyOn<any>(mouseMock, 'onMouseDown').and.callThrough();
        service.onMouseDown(mouseEvent);
        expect(mouseMock.onMouseDown).toHaveBeenCalled();
    });

    it("should call MouseHandlerService's #onMousemove on mousemove", () => {
        mouseEvent = {} as MouseEvent;
        spyOn<any>(mouseMock, 'onMouseMove').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(mouseMock.onMouseMove).toHaveBeenCalled();
    });

    it("should call MouseHandlerService's #onMouseLeave on mouseup", () => {
        mouseEvent = {} as MouseEvent;
        spyOn<any>(mouseMock, 'onMouseUp').and.callThrough();
        service.onMouseUp(mouseEvent);
        expect(mouseMock.onMouseUp).toHaveBeenCalled();
    });

    it('should  change status when #onMiddleRightResizerClicked is called', () => {
        service.onMiddleRightResizerClick();
        expect(service.status).toBe(Status.MIDDLE_RIGHT_RESIZE);
    });

    it('should  change status when #onMiddleBottomResizerClick is called', () => {
        service.onMiddleBottomResizerClick();
        expect(service.status).toBe(Status.MIDDLE_BOTTOM_RESIZE);
    });

    it('should  change status when #onBottomRightResizerClick is called', () => {
        service.onBottomRightResizerClick();
        expect(service.status).toBe(Status.BOTTOM_RIGHT_RESIZE);
    });

    it('should be able to calculate new canvas size', () => {
        spyOn<any>(mouseMock, 'calculateDeltaX').and.callThrough();
        spyOn<any>(mouseMock, 'calculateDeltaY').and.callThrough();
        // tslint:disable:no-string-literal
        service['status'] = Status.MIDDLE_BOTTOM_RESIZE;
        const val = service.calculateNewCanvasSize({ x: 300, y: 300 } as Coordinate);
        const expected = { x: 300, y: 400 } as Coordinate;
        expect(val).toEqual(expected);
    });
});
