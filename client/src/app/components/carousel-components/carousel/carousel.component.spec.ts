import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of, Subject } from 'rxjs';
import { CarouselComponent } from './carousel.component';

class CarouselServiceMock {
    drawingArrayMock: DrawingData = ([{ id: '1' } as DrawingData, { id: '1' } as DrawingData] as unknown) as DrawingData;
    initCarousel(): Observable<DrawingData[]> {
        return of([this.drawingArrayMock]);
    }

    getArraySizeOfDrawing(): Observable<number> {
        const subject = new Subject<number>();
        return subject.asObservable();
    }

    getDrawing(rightSearch: boolean): Observable<DrawingData> {
        const subject = new Subject<DrawingData>();
        return subject.asObservable();
    }

    openDrawing(drawing: DrawingData): void {}

    async deleteDrawing(id: string): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve('deleted');
        });
    }
}

const dialogMock = {
    close: () => {},
};

fdescribe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;
    let carouselServiceMock: CarouselServiceMock;

    beforeEach(async () => {
        carouselServiceMock = new CarouselServiceMock();
        await TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: CarouselService, useValue: carouselServiceMock },
            ],
            imports: [
                MatDialogModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
                MatInputModule,
                MatFormFieldModule,
                ReactiveFormsModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initCarousel should change value of isLoading if component has recieved the drawings', () => {
        component.initCarousel();
        expect(component.isLoading).toBe(false);
    });

    it('deleteDrawing sould remove one drawing from the list of drawing and call initCarousel', () => {
        component.deleteDrawing('1');
        expect(component.drawingArray.length).toEqual(1);
    });

    it('onDialogClose should empty array of drawing and reset isLoading', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.onDialogClose();
        expect(spy).toHaveBeenCalled();
    });

    it('onKeyDown should shift drawings in the right direction', () => {
        const shiftRightSpy = spyOn(component, 'shiftRight').and.stub();
        const shiftLeftSpy = spyOn(component, 'shiftLeft').and.stub();
        fixture.detectChanges();
        component.onKeyDown({ key: KeyboardButtons.Left } as KeyboardEvent);
        expect(shiftLeftSpy).toHaveBeenCalled();
        component.onKeyDown({ key: KeyboardButtons.Right } as KeyboardEvent);
        expect(shiftRightSpy).toHaveBeenCalled();
    });
});
