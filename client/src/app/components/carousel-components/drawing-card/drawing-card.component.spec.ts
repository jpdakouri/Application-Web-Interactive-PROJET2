import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingCardComponent } from './drawing-card.component';

class DrawingMock {
    id: string | undefined;
    title: string;
    tags: string[];
    dataURL: string | undefined;
    width: number;
    height: number;
    constructor() {
        // tslint:disable:no-magic-numbers
        (this.id = '111'), (this.title = 'testDrawing'), (this.tags = ['beau']), (this.dataURL = 'asdasdd'), (this.width = 300), (this.height = 300);
    }
}

describe('DrawingCardComponent', () => {
    let component: DrawingCardComponent;
    let fixture: ComponentFixture<DrawingCardComponent>;

    const drawing = new DrawingMock();
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
