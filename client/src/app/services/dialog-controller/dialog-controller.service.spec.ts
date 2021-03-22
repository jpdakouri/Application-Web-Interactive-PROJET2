import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DialogControllerService } from './dialog-controller.service';

describe('DialogControllerService', () => {
    let service: DialogControllerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MatDialog, useValue: {} },
            ],
        });
        service = TestBed.inject(DialogControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
