import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { UploadLinkComponent } from './upload-link.component';

describe('UploadLinkComponent', () => {
    let component: UploadLinkComponent;
    let fixture: ComponentFixture<UploadLinkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UploadLinkComponent],
            providers: [
                { provide: MatSnackBar, useValue: {} },
                { provide: MAT_SNACK_BAR_DATA, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
