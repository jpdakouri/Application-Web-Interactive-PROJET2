import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrentColourComponent } from './current-colour.component';

describe('CurrentColorComponent', () => {
    let component: CurrentColourComponent;
    let fixture: ComponentFixture<CurrentColourComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrentColourComponent],
            imports: [MatIconModule, MatButtonModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrentColourComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
