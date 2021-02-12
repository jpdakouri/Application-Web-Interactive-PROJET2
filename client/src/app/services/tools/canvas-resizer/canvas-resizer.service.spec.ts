import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';

class MockMouseService extends MouseHandlerService {
    deltaX: number = 400;
    deltaY: number = 300;
    calculateDeltaX = (): number => this.deltaX;
    calculateDeltaY = (): number => this.deltaY;

    // tslint:disable:no-empty
    onMouseDown = (): void => {};
    onMouseUp = (): void => {};
    onMouseMove = (): void => {};
}

// tslint:disable:no-any
describe('CanvasResizerService', () => {
    let mouseMock: MockMouseService;
    let service: CanvasResizerService;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        mouseMock = new MockMouseService();
        TestBed.configureTestingModule({
            providers: [{ provide: MouseHandlerService, useValue: mouseMock }],
        });
        service = TestBed.inject(CanvasResizerService);
        spyOn<any>(mouseMock, 'calculateDeltaX').and.callThrough();
        spyOn<any>(mouseMock, 'calculateDeltaY').and.callThrough();
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

    it('should be able to calculate new canvas size on middle right resizer click', () => {
        service.setStatus(Status.MIDDLE_RIGHT_RESIZE);

        const canvasSize = { x: 150, y: 300 } as Coordinate;
        const expectedCanvasSize = { x: 550, y: 300 } as Coordinate;

        const calculatedCanvasSize = service.calculateNewCanvasSize(canvasSize);
        expect(calculatedCanvasSize).toEqual(expectedCanvasSize);
    });

    it('should be able to calculate new canvas size on middle bottom resizer click', () => {
        service.setStatus(Status.MIDDLE_BOTTOM_RESIZE);

        const canvasSize = { x: 500, y: 300 } as Coordinate;
        const expectedCanvasSize = { x: 500, y: 600 } as Coordinate;

        const calculatedCanvasSize = service.calculateNewCanvasSize(canvasSize);
        expect(calculatedCanvasSize).toEqual(expectedCanvasSize);
    });
});
