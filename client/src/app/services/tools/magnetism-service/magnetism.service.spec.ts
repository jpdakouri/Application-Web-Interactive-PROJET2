import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/tools/magnetism-service/magnetism.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';

describe('MagnetismServiceService', () => {
    let service: MagnetismService;
    let mouseEvent: MouseEvent;
    let drawingService: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectedAreaCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        // tslint:disable-next-line:no-any

        service = TestBed.inject(MagnetismService);
        drawingService = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectedAreaCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawingService.baseCtx = baseCtxStub;
        drawingService.previewCtx = previewCtxStub;
        drawingService.selectedAreaCtx = selectedAreaCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButtons.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    xit('onMouseMove should change coords and call resizeSelection if status =/= OFF', () => {
        service.mouseDown = true;
        const coord = { x: 80, y: 80 };
        service.verifyInRangeCross(coord);

        service.onMouseMove(mouseEvent);
        // tslint:disable-next-line:no-any
        const findNearestLineLeftSpy = spyOn<any>(service, 'findNearestLineLeft').and.callThrough();
        // tslint:disable-next-line:no-any
        const findNearestLineTopSpy = spyOn<any>(service, 'findNearestLineTop').and.callThrough();

        expect(findNearestLineLeftSpy).toHaveBeenCalled();
        expect(findNearestLineTopSpy).toHaveBeenCalled();
    });

    it('onMouseUp sets mouse down to false and stop magnetism', () => {
        service.onMouseUp(new MouseEvent(''));
        expect(service.mouseDown).toBeFalse();
        expect(service.isMagnetismOnGoing).toBeFalse();
    });

    it('startKeys should set the defaul status and gridSize', () => {
        const gridSize = 50;
        drawingService.gridSize = gridSize;

        service.startKeys();
        expect(service.status).toBe(SelectionStatus.TOP_LEFT_BOX);
        expect(service.gridSize).toBe(drawingService.gridSize);
        // expect(service.updatePosition).toHaveBeenCalledWith(drawingService.gridSize);
    });

    it('findNearestLineLeft should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 98, y: 98 };
        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineLeft();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(48);
    });

    it('findNearestLineLeft place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 100, y: 100 };
        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineLeft();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(50);
    });

    it('findNearestRight should calculate the proper distance from the nearest cross depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 198, y: 98 };
        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineRight();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(-2);
    });

    it('findNearestLineRight place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 200, y: 100 };

        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineRight();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(-50);
    });

    it(' 111 findNearestLineTop place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 100, y: 198 };

        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineTop();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(48);
    });

    it(' 222 findNearestLineTop place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 100, y: 200 };

        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineTop();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(50);
    });

    it(' 333 findNearestLineDown place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 100, y: 198 };

        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineDown();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(-2);
    });

    it(' 333 findNearestLineDown place should find the proper distance depending on the position of the top left corner of the selection', () => {
        const positionLockedResizer = { x: 100, y: 200 };

        const gridSize = 50;

        service.lockedResizer = positionLockedResizer;
        service.gridSize = gridSize;
        const expectedDistance = service.findNearestLineDown();

        service.findLockedResizer();
        expect(expectedDistance).toEqual(-50);
    });

    it(' updatePosition should set the grid and update the selection"s position with respect to the top left corner ', () => {
        const grid = 50;
        const positionLockedResizer = { x: 100, y: 200 };
        service.lockedResizer = positionLockedResizer;
        service.status = SelectionStatus.TOP_LEFT_BOX;

        // tslint:disable-next-line:no-any
        const findNearestLineLeftSpy = spyOn<any>(service, 'findNearestLineLeft').and.callThrough();
        // tslint:disable-next-line:no-any
        const findNearestLineTopSpy = spyOn<any>(service, 'findNearestLineTop').and.callThrough();
        service.updatePosition(grid);

        expect(findNearestLineLeftSpy).toHaveBeenCalled();
        expect(findNearestLineTopSpy).toHaveBeenCalled();
    });

    it(' updatePosition should not set the grid and update the selection"s position if no corner is selected ', () => {
        const grid = 50;
        const positionLockedResizer = { x: 100, y: 200 };
        service.lockedResizer = positionLockedResizer;
        service.status = SelectionStatus.OFF;

        // tslint:disable-next-line:no-any
        const findNearestLineLeftSpy = spyOn<any>(service, 'findNearestLineLeft').and.callThrough();
        // tslint:disable-next-line:no-any
        const findNearestLineTopSpy = spyOn<any>(service, 'findNearestLineTop').and.callThrough();
        service.updatePosition(grid);

        expect(findNearestLineLeftSpy).not.toHaveBeenCalled();
        expect(findNearestLineTopSpy).not.toHaveBeenCalled();
    });

    it(' setStatus should set ready the service for a magnetic positionning ', () => {
        // tslint:disable-next-line:no-any
        const findLockedResizerSpy = spyOn<any>(service, 'findLockedResizer').and.callThrough();

        service.setStatus(SelectionStatus.TOP_LEFT_BOX);
        expect(service.mouseDown).toBe(true);
        expect(service.isMagnetismOnGoing).toBe(true);
        expect(findLockedResizerSpy).toHaveBeenCalled();
    });

    it(' setStatus should set ready the service for a magnetic positionning ', () => {
        // tslint:disable-next-line:no-any
        const findLockedResizerSpy = spyOn<any>(service, 'findLockedResizer').and.callThrough();

        service.setStatus(SelectionStatus.TOP_LEFT_BOX);
        expect(service.mouseDown).toBe(true);
        expect(service.isMagnetismOnGoing).toBe(true);
        expect(findLockedResizerSpy).toHaveBeenCalled();
    });

    // À revoir
    it(' updateDragPositionMagnetism should set the selectedArea canvas with the proper dimension ', () => {
        // tslint:disable-next-line:no-any

        const coord = { x: 80, y: 80 };

        // tslint:disable-next-line:no-any
        // const updateDragPositionMagnetismSpy = spyOn<any>(service, 'updateDragPositionMagnetism').withArgs(coord);

        // drawingService.selectedAreaCanvas.style.top ;
        // drawingService.selectedAreaCanvas.style.left;

        service.updateDragPositionMagnetism(coord);
        service.setStatus(SelectionStatus.TOP_LEFT_BOX);
    });

    it(' verifyInRangeCross should return false when the selected resizer is not near an intersection on the grid ', () => {
        // tslint:disable-next-line:no-any

        const positionLockedResizer = { x: 100, y: 100 };
        const gridSize = 50;
        service.lockedResizer = positionLockedResizer;

        service.gridSize = gridSize;
        const coord = { x: 80, y: 80 };
        const result = service.verifyInRangeCross(coord);

        expect(result).toBe(false);
    });

    // it(' verifyInRangeCross should return true when the selected resizer is near an intersection on the grid ', () => {
    //     // tslint:disable-next-line:no-any

    //     const positionLockedResizer = { x: 51, y: 51 };
    //     service.lockedResizer = positionLockedResizer;

    //     const gridSize = 50;
    //     service.gridSize = gridSize;

    //     const coord = { x: 51, y: 51 };
    //     const result = service.verifyInRangeCross(coord);

    //     expect(result).toBe(true);
    // });

    it(' isUsingMagnetism return true when the status is set defaut resizer ', () => {
        // tslint:disable-next-line:no-any

        service.status = SelectionStatus.TOP_LEFT_BOX;
        const result = service.isUsingMagnetism();
        expect(result).toBe(true);
    });

    it(' isUsingMagnetism return false when the status is not set defaut resizer ', () => {
        // tslint:disable-next-line:no-any

        service.status = SelectionStatus.OFF;
        const result = service.isUsingMagnetism();
        expect(result).toBe(false);
    });
});
