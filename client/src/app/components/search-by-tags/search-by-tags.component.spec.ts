import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from '@app/services/http/http.service';
import { INVALIDE_TAG_NAME_ERROR_MESSAGE, NO_ERROR_MESSAGE } from '@app/services/tools/tools-constants';
import { Tag } from '@app/utils/interfaces/tag';
import { HttpServiceMock } from '@app/utils/tests-mocks/http-service-mock';
import { of } from 'rxjs';
import { SearchByTagsComponent } from './search-by-tags.component';

describe('SearchByTagsComponent', () => {
    let component: SearchByTagsComponent;
    let fixture: ComponentFixture<SearchByTagsComponent>;
    let httpServiceMock: HttpServiceMock;

    beforeEach(async(() => {
        httpServiceMock = new HttpServiceMock();

        TestBed.configureTestingModule({
            providers: [{ provide: HttpService, useValue: httpServiceMock }],
            declarations: [SearchByTagsComponent],
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                MatExpansionModule,
                MatChipsModule,
                BrowserAnimationsModule,
                MatFormFieldModule,
                FormsModule,
                ReactiveFormsModule,
            ],
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

    it('it should be able to get correct messages errors for invalid tag name', () => {
        component.tagName.setValue('!!!');
        const invalideInput = component.getErrorMessageTag();
        expect(invalideInput).toBe(INVALIDE_TAG_NAME_ERROR_MESSAGE);
    });

    it('it should be able to get correct messages errors for valid tag name', () => {
        component.tagName.setValue('Good Input');
        const valideInput = component.getErrorMessageTag();
        expect(valideInput).toBe(NO_ERROR_MESSAGE);
    });

    it('remove should remove the tag if it is in the tag array', () => {
        component.tags.push({ name: 'tag1' } as Tag);
        component.tags.push({ name: 'tag2' } as Tag);
        component.tags.push({ name: 'tag3' } as Tag);
        fixture.detectChanges();
        component.remove({ name: 'tag4' } as Tag);
        // tslint:disable-next-line:no-magic-numbers
        expect(component.tags.length).toEqual(3);
        component.remove(component.tags[0]);
        expect(component.tags.length).toEqual(2);
    });

    it('addChip should add a tag to the array if the input condition are respected', () => {
        const valideChipInput = ({ input: '', value: 'inputedValue' } as unknown) as MatChipInputEvent;
        const invalideChipInput = ({ input: '', value: '' } as unknown) as MatChipInputEvent;
        component.addChip(valideChipInput);
        component.addChip(invalideChipInput);
        expect(component.tags[0].name).toEqual('inputedValue');
        expect(component.tags.length).toEqual(1);
    });

    it('toStringArray should return an array of tags in string format', () => {
        const tagArray = [{} as Tag, {} as Tag];
        expect(component.toStringArray(tagArray).length).toEqual(2);
    });

    it('sendTags should send a drawing to the server', () => {
        component.tags = [{ name: 'tag1' }, { name: 'tag2' }];
        spyOn(httpServiceMock, 'sendTags').and.returnValue(of('result'));
        spyOn(component, 'toStringArray').and.returnValue(['tag1', 'tag2']);
        spyOn(component.tagFlag, 'emit');

        component.sendTags();
        expect(component.toStringArray).toHaveBeenCalledWith([{ name: 'tag1' }, { name: 'tag2' }]);
        expect(httpServiceMock.sendTags).toHaveBeenCalledWith(['tag1', 'tag2']);
        expect(component.tagFlag.emit).toHaveBeenCalled();
    });
});
