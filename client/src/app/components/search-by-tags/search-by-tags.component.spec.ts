import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchByTagsComponent } from './search-by-tags.component';

describe('SearchByTagsComponent', () => {
    let component: SearchByTagsComponent;
    let fixture: ComponentFixture<SearchByTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchByTagsComponent],
            imports: [HttpClientTestingModule, MatDialogModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchByTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
