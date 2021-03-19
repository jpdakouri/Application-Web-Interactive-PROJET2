import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ExportDrawingServiceMock } from '@app/tests-mocks/export-drawing-service-mock';
import { ExportDrawingComponent } from './export-drawing.component';
// import { ImageFilter } from '@app/utils/enums/image-filter.enum';

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let exportDrawingMock: ExportDrawingServiceMock;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['']);
        exportDrawingMock = new ExportDrawingServiceMock();

        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: ExportDrawingService, useValue: exportDrawingMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
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
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        component = fixture.componentInstance;
        // component.originalCanvas = canvasTestHelper.canvas;
        // component.selectedFilterValue = 'none';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
