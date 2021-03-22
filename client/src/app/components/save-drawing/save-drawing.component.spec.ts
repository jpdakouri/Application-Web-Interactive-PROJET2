import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import {
    INVALIDE_TAG_NAME_ERROR_MESSAGE,
    INVALID_FILE_NAME_ERROR_MESSAGE,
    NO_ERROR_MESSAGE,
    REQUIRED_FILE_NAME_ERROR_MESSAGE,
} from '@app/services/tools/tools-constants';
import { Tag } from '@app/utils/interfaces/tag';
import { SaveDrawingServiceMock } from '@app/utils/tests-mocks/save-drawing-mock';
import { SaveDrawingComponent } from './save-drawing.component';

const dialogMock = {
    // tslint:disable:no-empty
    close: () => {},
};

describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let saveDrawingServiceMock: SaveDrawingServiceMock;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(async () => {
        canvasTestHelper = new CanvasTestHelper();
        saveDrawingServiceMock = new SaveDrawingServiceMock();
        await TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: HttpClient, useValue: {} },
                { provide: SaveDrawingService, useValue: saveDrawingServiceMock },
                { provide: HTMLCanvasElement, useValue: canvasTestHelper },
            ],
            imports: [MatDialogModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatSelectModule, BrowserAnimationsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onDialogClose should close close the dialog', () => {
        spyOn(dialogMock, 'close').and.callThrough();
        component.onDialogClose();
        expect(dialogMock.close).toHaveBeenCalled();
    });

    it('it should be able to get correct messages errors for fileName', () => {
        component.fileName.setValue('drawing1');
        const expectedErrorMessage = component.getErrorMessageName();
        expect(expectedErrorMessage).toBe(NO_ERROR_MESSAGE);

        component.fileName.setValue('):');
        const invalidFileNameError = component.getErrorMessageName();
        expect(invalidFileNameError).toBe(INVALID_FILE_NAME_ERROR_MESSAGE);

        component.fileName.setValue('');
        const noNameInputError = component.getErrorMessageName();
        expect(component.fileName.hasError('required')).toBeTruthy();
        expect(noNameInputError).toBe(REQUIRED_FILE_NAME_ERROR_MESSAGE);
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

    it('updateService should update the values of the services', () => {
        component.fileName = new FormControl('testing');
        component.updateService();
        fixture.detectChanges();
        expect(saveDrawingServiceMock.fileName).toEqual('testing');
    });

    it('addDrawing should call the service s addDrawing', () => {
        spyOn(saveDrawingServiceMock, 'addDrawing').and.stub();
        component.addDrawing();
        expect(saveDrawingServiceMock.addDrawing).toHaveBeenCalled();
    });

    it('remove should remove the tag if it is in the tag array', () => {
        component.tags.push({ name: 'tag1' } as Tag);
        component.tags.push({ name: 'tag2' } as Tag);
        component.tags.push({ name: 'tag3' } as Tag);
        component.originalCanvas = canvasTestHelper.canvas;
        fixture.detectChanges();
        component.remove({ name: 'tag4' } as Tag);
        // tslint:disable-next-line:no-magic-numbers
        expect(component.tags.length).toEqual(3);
        component.remove(component.tags[0]);
        expect(component.tags.length).toEqual(2);
    });

    it('addChip should add a tag to the array if the input condition are respected', () => {
        const valideChipInput = ({ input: '', value: 'inputedValue' } as unknown) as MatChipInputEvent;
        const inputV = document.getElementById('tagValue');
        component = fixture.componentInstance;
        const invalideChipInput = ({ input: inputV, value: '' } as unknown) as MatChipInputEvent;

        component.addChip(valideChipInput);
        expect(component.tags[0].name).toEqual('inputedValue');
        component.addChip(invalideChipInput);
        expect(component.tags.length).toEqual(1);
    });
});
