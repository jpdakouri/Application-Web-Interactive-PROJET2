import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServerErrorMessageComponent } from './server-error-message.component';

const dialogMock = {
    // tslint:disable:no-empty
    close: () => {},
};
describe('ServerErrorMessageComponent', () => {
    let component: ServerErrorMessageComponent;
    let fixture: ComponentFixture<ServerErrorMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
            ],
            imports: [
                HttpClientTestingModule,
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
                MatDialogModule,
                MatIconModule,
                MatInputModule,
                MatFormFieldModule,
                ReactiveFormsModule,
            ],
            declarations: [ServerErrorMessageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ServerErrorMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog', () => {
        spyOn(dialogMock, 'close').and.callThrough();
        component.close();
        expect(dialogMock.close).toHaveBeenCalled();
    });
});
