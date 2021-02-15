import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { ColourPaletteSelectorComponent } from './colour-palette-selector.component';

const TOP_LEFT_CORNER_RGB = 254;
describe('ColourPaletteSelectorComponent', () => {
    let component: ColourPaletteSelectorComponent;
    let fixture: ComponentFixture<ColourPaletteSelectorComponent>;
    let canvasContext: CanvasRenderingContext2D;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourPaletteSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const context = component.paletteCanvas.nativeElement.getContext('2d');
        if (context != null) canvasContext = context;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit draws the palette', () => {
        component.ngAfterViewInit();
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[1]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[2]).toBe(TOP_LEFT_CORNER_RGB);
    });
    it('onMouseDown draws the palette', () => {
        const clickEvent = new MouseEvent('mousedown');
        component.onMouseDown(clickEvent);
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[1]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[2]).toBe(TOP_LEFT_CORNER_RGB);
    });
    it('onMouseMove draws the palette', () => {
        const moveEvent = new MouseEvent('mousemove');
        component.onMouseMove(moveEvent);
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[1]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[2]).toBe(TOP_LEFT_CORNER_RGB);
    });
    it('ngOnChanges draws the palette when the hue is changed', () => {
        const redHue = 'rgba(255,0,0,1)';
        component.ngOnChanges({ hue: new SimpleChange(null, redHue, false) });
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[1]).toBe(TOP_LEFT_CORNER_RGB);
        expect(topLeftPixelColor[2]).toBe(TOP_LEFT_CORNER_RGB);
    });

    it('a circular selector is drawn around the selected location', () => {
        const clickLocation = 100;
        const circleRadius = 10;
        const pureWhiteRgb = 255;
        const clickEvent = new MouseEvent('mousedown', { clientX: clickLocation, clientY: clickLocation });
        component.onMouseDown(clickEvent);
        const topColor = canvasContext.getImageData(clickLocation, clickLocation - circleRadius, 1, 1).data;
        expect(topColor[0]).toBe(pureWhiteRgb);
        expect(topColor[1]).toBe(pureWhiteRgb);
        expect(topColor[2]).toBe(pureWhiteRgb);
        const leftColor = canvasContext.getImageData(clickLocation - circleRadius, clickLocation, 1, 1).data;
        expect(leftColor[0]).toBe(pureWhiteRgb);
        expect(leftColor[1]).toBe(pureWhiteRgb);
        expect(leftColor[2]).toBe(pureWhiteRgb);
        const rightColor = canvasContext.getImageData(clickLocation + circleRadius, clickLocation, 1, 1).data;
        expect(rightColor[0]).toBe(pureWhiteRgb);
        expect(rightColor[1]).toBe(pureWhiteRgb);
        expect(rightColor[2]).toBe(pureWhiteRgb);
        const bottomColor = canvasContext.getImageData(clickLocation, clickLocation + circleRadius, 1, 1).data;
        expect(bottomColor[0]).toBe(pureWhiteRgb);
        expect(bottomColor[1]).toBe(pureWhiteRgb);
        expect(bottomColor[2]).toBe(pureWhiteRgb);
    });

    it('removeChromeContextMenu always returns false', () => {
        expect(component.removeChromeContextMenu()).toBeFalse();
    });

    it('a color is only emitted on mouse up based on the button that is unclicked', () => {
        const currentColorService = TestBed.inject(CurrentColourService);
        spyOn(currentColorService, 'setPrimaryColorRgb');
        spyOn(currentColorService, 'setSecondaryColorRgb');
        const clickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
        component.onMouseDown(clickEvent);
        const moveEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
        component.onMouseMove(moveEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledTimes(0);
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledTimes(0);
        const unLeftClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 });
        component.onMouseUp(unLeftClickEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledTimes(1);
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledTimes(0);
        const unRightClickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 });
        component.onMouseUp(unRightClickEvent);
        expect(currentColorService.setPrimaryColorRgb).toHaveBeenCalledTimes(1);
        expect(currentColorService.setSecondaryColorRgb).toHaveBeenCalledTimes(1);
    });
});
