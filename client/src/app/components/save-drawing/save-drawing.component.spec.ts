import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveDrawingComponent } from './save-drawing.component';

describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            providers: [
                // { provide: MatDialogRef, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
            imports: [MatDialogModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatSelectModule, BrowserAnimationsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
