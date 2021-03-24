import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorHistoryService } from '@app/services/color-history/color-history.service';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { ColorHistoryComponent } from './color-history.component';

describe('ColorHistoryComponent', () => {
    let component: ColorHistoryComponent;
    let fixture: ComponentFixture<ColorHistoryComponent>;
    let historyService: ColorHistoryService;
    let currentColorService: CurrentColorService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorHistoryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        historyService = TestBed.inject(ColorHistoryService);
        currentColorService = TestBed.inject(CurrentColorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('selectPrimaryColor gets the primary color from the history service and sends it to currentColorService set method', () => {
        spyOn(historyService, 'getColor').and.returnValue('rgb(255,255,255)');
        spyOn(currentColorService, 'setPrimaryColorRgb');
        component.selectPrimaryColor(0);
        expect(historyService.getColor).toHaveBeenCalled();
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });

    it('selectSecondaryColor gets the secondary color from the history service and sends it to currentColorService set method', () => {
        spyOn(historyService, 'getColor').and.returnValue('rgb(255,255,255)');
        spyOn(currentColorService, 'setSecondaryColorRgb');
        component.selectSecondaryColor(0);
        expect(historyService.getColor).toHaveBeenCalled();
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledWith('255,255,255');
    });

    it('createArray should return an array of chosen size', () => {
        spyOn(component, 'createArray').and.callThrough();
        const arraySize = 10;
        const expected = Array(arraySize);
        expect(component.createArray(arraySize)).toEqual(expected);
    });
});
