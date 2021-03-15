import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
            imports: [MatDialogModule, HttpClientModule],
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
