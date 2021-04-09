import { TestBed } from '@angular/core/testing';
import { SelectionPolygonalLassoService } from './selection-polygonal-lasso.service';

describe('SelectionPolygonalLassoService', () => {
    let service: SelectionPolygonalLassoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionPolygonalLassoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
