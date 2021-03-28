import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(GridService);
    });
    // tslint:disable:no-magic-numbers

    it('should be created', () => {
        expect(service).toBeTruthy();
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
        service.gridSize = 296;
        let retValue = service.gridSizeCanModify(true);
        expect(retValue).toEqual(false);

        service.gridSize = 294;
        retValue = service.gridSizeCanModify(true);
        expect(retValue).toEqual(true);
    });

    it('gridSizeCanModify should return true if the size decrease is valide', () => {
        service.gridSize = 54;
        let retValue = service.gridSizeCanModify(false);
        expect(retValue).toEqual(false);

        service.gridSize = 55;
        retValue = service.gridSizeCanModify(false);
        expect(retValue).toEqual(true);
    });
});
