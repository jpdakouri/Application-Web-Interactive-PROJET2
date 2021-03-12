import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingService', () => {
    let service: SaveDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: MatDialogRef, useValue: {} }],
            imports: [
                HttpClientTestingModule,
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
                MatDialogModule,
                MatInputModule,
                MatFormFieldModule,
                ReactiveFormsModule,
            ],
        });
        service = TestBed.inject(SaveDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
