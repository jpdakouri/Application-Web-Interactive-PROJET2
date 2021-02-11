import { TestBed } from '@angular/core/testing';
// import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';
//
// class MockMouseService extends MouseHandlerService {
//     startCoordinate: Coordinate = { x: 965, y: 400 };
//     endCoordinate: Coordinate = { x: 456, y: 236 };
//
//     // tslint:disable-next-line:no-magic-numbers
//     calculateDeltaX = (): number => 795;
//     // tslint:disable-next-line:no-magic-numbers
//     calculateDeltaY = (): number => 651;
// }

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;
    let mouseEvent: MouseEvent;
    // const mouseServiceSpy: MockMouseService = new MockMouseService();
    let mouseServiceSpy: jasmine.SpyObj<MouseHandlerService>;

    beforeEach(() => {
        mouseServiceSpy = jasmine.createSpyObj('MockMouseService', [
            'onMouseDown',
            'onMouseMove',
            'onMouseUp',
            'onMouseLeave',
            'eventToCoordinate',
            'calculateDeltaX',
            'calculateDeltaY',
        ]);
        TestBed.configureTestingModule({
            providers: [{ provide: MouseHandlerService, useValue: mouseServiceSpy }],
        });
        service = TestBed.inject(CanvasResizerService);
        // mouseServiceSpy = TestBed.inject(MockMouseService) as jasmine.SpyObj<MouseHandlerService>;
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

    // it('should be able to calculate new canvas size', () => {
    //     service.status = Status.MIDDLE_RIGHT_RESIZE;
    //     const canvasSize: Coordinate = { x: 789, y: 789 };
    //     const expectedCanvas: Coordinate = { x: 20, y: 20 };
    //     // tslint:disable-next-line:no-magic-numbers
    //     // spyOn(mouseServiceSpy, 'calculateDeltaX').and.returnValue(350);
    //     // deltaXSpy// mouseServiceSpy.endCoordinate = { x: 105, y: 510 }; // mouseServiceSpy.startCoordinate = { x: 10, y: 10 };
    //     // spyOn(service, 'calculateNewCanvasSize').withArgs({ x: 789, y: 789 });
    //     mouseServiceSpy.endCoordinate = { x: 599, y: 545 };
    //     console.log('delatX ------------= ' + mouseServiceSpy.calculateDeltaX());
    //     console.log('delatY ------------= ' + service.calculateNewCanvasSize(canvasSize).y);
    //     expect(service.calculateNewCanvasSize).toEqual(expectedCanvas);
    // });
});
