import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { Tag } from '@app/utils/interfaces/tag';
import { DrawingDataMock } from '@app/utils/tests-mocks/drawing-data-mock';
import { SaveDrawingComponent } from './save-drawing.component';

const dialogMock = {
    close: () => {},
};

class SaveDrawingServiceMock {
    originalCanvas: HTMLCanvasElement;
    id: number;
    image: ElementRef<HTMLImageElement>;
    fileName: string;

    drawing: DrawingDataMock;
    labelsChecked: Tag[];

    constructor() {}

    getDataURLFromCanvas(): string {
        return '';
    }

    addDrawing(): void {}

    toStringArray(labels: Tag[]): string[] {
        return new Array<string>();
    }
}

fdescribe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let saveDrawingServiceMock: SaveDrawingServiceMock;

    beforeEach(async () => {
        saveDrawingServiceMock = new SaveDrawingServiceMock();
        await TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: HttpClient, useValue: {} },
                { provide: SaveDrawingService, useValue: saveDrawingServiceMock },
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
        fixture.detectChanges();
        component.remove({ name: 'tag4' } as Tag);
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
});
