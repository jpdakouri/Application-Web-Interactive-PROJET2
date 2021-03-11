import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';
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
