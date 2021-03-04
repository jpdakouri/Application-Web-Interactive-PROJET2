import { TestBed } from '@angular/core/testing';
import { SelectionRectangleService } from './selection-rectangle.service';

describe('SelectionRectangleServiceService', () => {
    let service: SelectionRectangleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionRectangleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
