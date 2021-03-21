import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { DrawingData } from '@common/communication/drawing-data';
import { DrawingCardComponent } from './drawing-card.component';

const snackBarMock = {
    open: () => {},
};
fdescribe('DrawingCardComponent', () => {
    let component: DrawingCardComponent;
    let fixture: ComponentFixture<DrawingCardComponent>;

    const drawing = new DrawingDataMock('1');
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DrawingCardComponent],
            imports: [MatCardModule],
            providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingCardComponent);
        component = fixture.componentInstance;
        const positionData = { width: '100%', height: '100%', position: 'main' };
        component.positionCaracteristics = positionData;
        component.infoDrawing = drawing;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('toOpen should be emitted when open is called', () => {
        spyOn(component.toOpen, 'emit');
        component.open();
        expect(component.toOpen.emit).toHaveBeenCalledWith(true);
    });

    it('toDelete should be emitted when deleteDrawing is called', () => {
        spyOn(component.toDelete, 'emit');
        component.deleteDrawing();
        expect(component.toDelete.emit).toHaveBeenCalledWith(true);
    });

    it('the drawingData setter should set the drawing to the new value', () => {
        component.drawingData = { id: '1', width: 200, height: 100 } as DrawingData;
        expect(component.infoDrawing.id).toEqual('1');
    });
});
