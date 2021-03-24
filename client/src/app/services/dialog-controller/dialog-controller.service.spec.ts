import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { EMPTY } from 'rxjs';
import { DialogControllerService } from './dialog-controller.service';
const dialogMock = {
    // tslint:disable:no-any
    open: (component: any, input: any) => {
        return;
    },
};
describe('DialogControllerService', () => {
    let service: DialogControllerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            providers: [{ provide: MatDialog, useValue: dialogMock }],
        });
        service = TestBed.inject(DialogControllerService);
        spyOn(service.dialog, 'open')
            .and.stub()
            .and.returnValue({ afterClosed: () => EMPTY });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('openDialog should open the SaveDrawingComponent dialog the input is save', () => {
        service.openDialog('save');
        expect(service.dialog.open).toHaveBeenCalledWith(SaveDrawingComponent, {});
    });

    it('openDialog should open the ExportDrawingComponent dialog the input is export', () => {
        service.openDialog('export');
        expect(service.dialog.open).toHaveBeenCalledWith(ExportDrawingComponent, {});
    });

    it('openDialog should open the CarouselComponent dialog the input is carousel', () => {
        service.openDialog('carousel');
        expect(service.dialog.open).toHaveBeenCalledWith(CarouselComponent, {});
    });

    it('openDialog not should open if the input is invalid ', () => {
        service.openDialog('notValide');
        expect(service.dialog.open).not.toHaveBeenCalled();
    });

    it('openDialog not should open if another dialog is opened', () => {
        service.noDialogOpened = false;
        service.openDialog('carousel');
        expect(service.dialog.open).not.toHaveBeenCalled();
    });
});
