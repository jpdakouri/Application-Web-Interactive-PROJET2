import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ImgurApiService } from '@app/services/imgur-api/imgur-api.service';
import { INVALID_FILE_NAME_ERROR_MESSAGE, NO_ERROR_MESSAGE, REQUIRED_FILE_NAME_ERROR_MESSAGE } from '@app/services/services-constants';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { ExportDrawingServiceMock } from '@app/utils/tests-mocks/export-drawing-service-mock';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let exportDrawingMock: ExportDrawingServiceMock;
    // @ts-ignore
    let imgurApiServiceSpy: jasmine.SpyObj<ImgurApiService>;
    const dialogMock = {
        // tslint:disable-next-line:no-empty
        close: () => {},
    };

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['']);
        // @ts-ignore
        imgurApiServiceSpy = jasmine.createSpy('ImgurApiService', ['upload']);
        exportDrawingMock = new ExportDrawingServiceMock();

        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: ExportDrawingService, useValue: exportDrawingMock },
                { provide: ImgurApiService, useValue: exportDrawingMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            imports: [
                BrowserAnimationsModule,
                HttpClientModule,
                MatSnackBarModule,
                MatOptionModule,
                MatSelectModule,
                MatIconModule,
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should subscribe to ExportDrawingService's current filter", async(() => {
        const mockFilter = 'sepia(100%)';
        exportDrawingMock.currentFilter.next(mockFilter);
        exportDrawingMock.currentFilter.subscribe((res: string) => {
            expect(res).toBe(mockFilter);
        });
        exportDrawingMock.currentFilter.complete();
    }));

    it("should subscribe to ExportDrawingService's current format", async(() => {
        const mockFormat = ImageFormat.PNG;
        exportDrawingMock.currentFormat.next(mockFormat);
        exportDrawingMock.currentFormat.subscribe((res: string) => {
            expect(res).toBe(mockFormat);
        });
        exportDrawingMock.currentFormat.complete();
    }));

    it('#dialogClose should close the dialog', () => {
        // tslint:disable:no-any
        const closeSpy = spyOn<any>(component.dialogRef, 'close').and.callThrough();
        component.onDialogClose();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('#onDialogClose should call #dialogClose', () => {
        const dialogCloseSpy = spyOn<any>(component, 'closeDialog').and.callThrough();
        component.onDialogClose();
        expect(dialogCloseSpy).toHaveBeenCalled();
    });

    it('#onFilterChange should change selectedFilterValue and update exportDrawingService current filter', () => {
        const selectedFilter = ImageFilter.Blur;
        const expectedFilterValue = 'blur(5px)';
        const filterChangeNextSpy = spyOn(exportDrawingMock.currentFilter, 'next').and.callThrough();

        component.onFilterChange(selectedFilter);

        expect(component.selectedFilterValue).toBe(expectedFilterValue);
        expect(filterChangeNextSpy).toHaveBeenCalled();
        expect(filterChangeNextSpy).toHaveBeenCalledWith(selectedFilter);
    });

    it('#onFormatChange should update exportDrawingService current format', () => {
        const selectedFilter = ImageFormat.PNG;
        const expectedFormat = ImageFormat.PNG;
        const formatChangeNextSpy = spyOn(exportDrawingMock.currentFormat, 'next').and.callThrough();

        component.onFormatChange(expectedFormat);

        expect(formatChangeNextSpy).toHaveBeenCalled();
        expect(formatChangeNextSpy).toHaveBeenCalledWith(selectedFilter);
    });

    it('onDownload should correctly set image source and call ExportDrawingService download method', () => {
        component.imageSource = 'abed';
        const downloadDrawingSpy = spyOn<any>(exportDrawingMock, 'downloadDrawingAsImage').and.stub();
        const expectedImageSource = component.imageSource;

        component.onDownload();

        expect(exportDrawingMock.imageSource).toBe(expectedImageSource);
        expect(downloadDrawingSpy).toHaveBeenCalled();
    });

    it('it should be able to get correct messages errors for fileName', () => {
        component.fileName.setValue('drawing1');
        const expectedErrorMessage = component.getErrorMessage();
        expect(expectedErrorMessage).toBe(NO_ERROR_MESSAGE);

        component.fileName.setValue('):');
        const invalidFileNameError = component.getErrorMessage();
        expect(invalidFileNameError).toBe(INVALID_FILE_NAME_ERROR_MESSAGE);

        component.fileName.setValue('');
        const noNameInputError = component.getErrorMessage();
        expect(component.fileName.hasError('required')).toBeTruthy();
        expect(noNameInputError).toBe(REQUIRED_FILE_NAME_ERROR_MESSAGE);
    });
});
