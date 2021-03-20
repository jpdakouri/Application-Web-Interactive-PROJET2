import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { DrawingCardComponent } from './drawing-card.component';

describe('DrawingCardComponent', () => {
    let component: DrawingCardComponent;
    let fixture: ComponentFixture<DrawingCardComponent>;

    const drawing = new DrawingDataMock('1');
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DrawingCardComponent],
            imports: [MatCardModule],
            providers: [{ provide: MatSnackBar, useValue: {} }],
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
});
