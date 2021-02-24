import { TestBed } from '@angular/core/testing';
import { SelectionRectangleEllipseService } from './selection-rectangle-ellipse-service.service';

describe('SelectionRectangleEllipseServiceService', () => {
    let service: SelectionRectangleEllipseService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionRectangleEllipseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
