import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HTMLCanvasElement, useValue: canvasTestHelper },
            ],
        });
        service = TestBed.inject(GridService);
    });
    // tslint:disable:no-magic-numbers

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('newGrid should call stroke on the gridCtx', () => {
        drawServiceSpy.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable:no-string-literal
        const initialSize = service['drawingService'].gridSize;
        service.newGrid(null);
        expect(service['drawingService'].gridSize).toEqual(initialSize);
        service.newGrid(55);
        expect(service['drawingService'].gridSize).not.toEqual(initialSize);
    });

    it('clear should reset the opacity', () => {
        service.gridOpacity = '0.5';
        service.clear();
        expect(service.gridOpacity).toEqual('1');
    });

    it('changeOpacity should change the value of opacity if there was an input', () => {
        service.gridOpacity = '0.5';
        spyOn(service, 'newGrid').and.stub();
        service.changeOpacity(0.8);
        expect(service.gridOpacity).toEqual('0.8');
        service.changeOpacity(null);
        expect(service.gridOpacity).toEqual('0.8');
    });

    it('gridSizeCanModify should return true if the size increase is valide', () => {
        service['drawingService'].gridSize = 296;
        let retValue = service.gridSizeCanModify(true);
        expect(retValue).toEqual(false);

        service['drawingService'].gridSize = 294;
        retValue = service.gridSizeCanModify(true);
        expect(retValue).toEqual(true);
    });

    it('gridSizeCanModify should return true if the size decrease is valide', () => {
        service['drawingService'].gridSize = 14;
        let retValue = service.gridSizeCanModify(false);
        expect(retValue).toEqual(false);

        service['drawingService'].gridSize = 55;
        retValue = service.gridSizeCanModify(false);
        expect(retValue).toEqual(true);
    });

    it('getGridSize should return  grid size', () => {
        service['drawingService'].gridSize = 50;
        const ret = service.getGridSize();
        expect(ret).toEqual(50);
    });
});
