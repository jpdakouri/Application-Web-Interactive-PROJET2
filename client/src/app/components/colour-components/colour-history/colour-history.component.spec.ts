import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourHistoryService } from '@app/services/colour-history/colour-history.service';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { ColourHistoryComponent } from './colour-history.component';

describe('ColourHistoryComponent', () => {
    let component: ColourHistoryComponent;
    let fixture: ComponentFixture<ColourHistoryComponent>;
    let historyService: ColourHistoryService;
    let currentColorService: CurrentColourService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourHistoryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        historyService = TestBed.inject(ColourHistoryService);
        currentColorService = TestBed.inject(CurrentColourService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('selectPrimaryColor gets the primary colour from the history service and sends it to currentColorService set method', () => {
        spyOn(historyService, 'getColour').and.returnValue('rgb(255,255,255)');
        spyOn(currentColorService, 'setPrimaryColorRgb');
        component.selectPrimaryColor(0);
        expect(historyService.getColour).toHaveBeenCalled();
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });

    it('selectSecondaryColor gets the secondary colour from the history service and sends it to currentColorService set method', () => {
        spyOn(historyService, 'getColour').and.returnValue('rgb(255,255,255)');
        spyOn(currentColorService, 'setSecondaryColorRgb');
        component.selectSecondaryColor(0);
        expect(historyService.getColour).toHaveBeenCalled();
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });

    it('createArray should return an array of chosen size', () => {
        spyOn(component, 'createArray').and.callThrough();
        const arraySize = 10;
        const expected = Array(arraySize);
        expect(component.createArray(arraySize)).toEqual(expected);
    });
});
