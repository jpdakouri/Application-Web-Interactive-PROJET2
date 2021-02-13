import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@app/classes/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from './canvas-resizer.service';

class MockMouseService extends MouseHandlerService {
    deltaX: number = 400;
    deltaY: number = 300;

    startCoordinate: Coordinate = { x: 400, y: 200 };
    currentCoordinate: Coordinate = { x: 600, y: 450 };
    endCoordinate: Coordinate = { x: 500, y: 400 };

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

    beforeAll(() => {
        // tslint:disable-next-line:typedef
        // @ts-ignore
        matchMedia(window);
        // tslint:disable-next-line:typedef
        window.resizeTo = function resizeTo(width, height) {
            // tslint:disable:no-invalid-this
            Object.assign(this, {
                innerWidth: width,
                innerHeight: height,
            }).dispatchEvent(new this.Event('resize'));
        };
    });

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
        service.status = Status.BOTTOM_RIGHT_RESIZE;
        mouseEvent = {} as MouseEvent;
        spyOn<any>(mouseMock, 'onMouseMove').and.callThrough();
        spyOn(service, 'resizePreviewCanvas');
        service.onMouseMove(mouseEvent);
        expect(mouseMock.onMouseMove).toHaveBeenCalled();
        expect(service.resizePreviewCanvas).toHaveBeenCalled();
    });

    it('should not resize preview canvas when status is not resizing', () => {
        service.status = Status.OFF;
        mouseEvent = {} as MouseEvent;
        spyOn<any>(mouseMock, 'onMouseMove').and.callThrough();
        spyOn(service, 'resizePreviewCanvas');
        service.onMouseMove(mouseEvent);
        expect(mouseMock.onMouseMove).toHaveBeenCalled();
        expect(service.resizePreviewCanvas).not.toHaveBeenCalled();
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

    it('should be able to calculate new canvas size on bottom resizer click', () => {
        service.setStatus(Status.BOTTOM_RIGHT_RESIZE);

        const canvasSize = { x: 500, y: 300 } as Coordinate;
        const expectedCanvasSize = { x: 900, y: 600 } as Coordinate;

        const calculatedCanvasSize = service.calculateNewCanvasSize(canvasSize);
        expect(calculatedCanvasSize).toEqual(expectedCanvasSize);
    });

    it('new canvas size should be 250 pixels when canvas width is lower than 250 pixels', () => {
        service.setStatus(Status.BOTTOM_RIGHT_RESIZE);

        const canvasSize = { x: -350, y: -300 } as Coordinate;
        const expectedCanvasSize = { x: 250, y: 250 } as Coordinate;

        const calculatedCanvasSize = service.calculateNewCanvasSize(canvasSize);
        expect(calculatedCanvasSize).toEqual(expectedCanvasSize);
    });

    it('new canvas size should be 250 pixels when canvas height is lower than 250 pixels', () => {
        service.setStatus(Status.BOTTOM_RIGHT_RESIZE);

        const canvasSize = { x: 350, y: -300 } as Coordinate;
        const expectedCanvasSize = { x: 750, y: 250 } as Coordinate;

        const calculatedCanvasSize = service.calculateNewCanvasSize(canvasSize);
        expect(calculatedCanvasSize).toEqual(expectedCanvasSize);
    });

    xit('should be able to calculate previewCanvas width on middle right resize', () => {
        service.setStatus(Status.MIDDLE_RIGHT_RESIZE);
        service.resizePreviewCanvas();
        const expectedWidth = 306;
        expect(service.canvasPreviewWidth).toEqual(expectedWidth);
    });

    it('should be able to calculate previewCanvas height on middle bottom resize', () => {
        service.setStatus(Status.MIDDLE_BOTTOM_RESIZE);
        service.resizePreviewCanvas();
        const expectedHeight = 450;
        expect(service.canvasPreviewHeight).toEqual(expectedHeight);
    });

    xit('should be able to calculate previewCanvas width and height on bottom right resize', () => {
        service.setStatus(Status.BOTTOM_RIGHT_RESIZE);
        service.resizePreviewCanvas();
        const expectedWidth = 306;
        const expectedHeight = 450;
        expect(service.canvasPreviewWidth).toEqual(expectedWidth);
        expect(service.canvasPreviewHeight).toEqual(expectedHeight);
    });

    xit('should be able to calculate canvas size', () => {
        const windowWidth = 1214;
        const windowHeight = 800;
        const expectedCanvasSize = { x: 460, y: 400 };

        // we resize the window to always have the size during the test
        window.resizeTo(windowWidth, windowHeight);

        const calculatedCanvasSize = service.calculateCanvasSize() as Coordinate;
        expect(calculatedCanvasSize.x).toEqual(expectedCanvasSize.x);
        expect(calculatedCanvasSize.y).toEqual(expectedCanvasSize.y);
    });

    xit('canvasSize should be 250x250 pixels when working zone size is lower than 250x250 pixels ', () => {
        const windowWidth = 500;
        const windowHeight = 400;
        const expectedCanvasSize = { x: 250, y: 250 };

        // we resize the window to always have the size during the test
        window.resizeTo(windowWidth, windowHeight);

        const calculatedCanvasSize = service.calculateCanvasSize() as Coordinate;
        expect(calculatedCanvasSize.x).toEqual(expectedCanvasSize.x);
        expect(calculatedCanvasSize.y).toEqual(expectedCanvasSize.y);
    });
});
