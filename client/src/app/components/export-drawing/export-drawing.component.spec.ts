import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    // let canvasTestHelper: CanvasTestHelper;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [{ provide: MatDialogRef, useValue: {} }],
            imports: [
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
                MatDialogModule,
                MatInputModule,
                MatFormFieldModule,
                ReactiveFormsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        // canvasTestHelper = TestBed.inject(CanvasTestHelper);
        // component.originalCanvas = canvasTestHelper.canvas;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
