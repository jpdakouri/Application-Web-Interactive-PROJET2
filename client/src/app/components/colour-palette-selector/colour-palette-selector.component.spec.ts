import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourPaletteSelectorComponent } from './colour-palette-selector.component';

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
        const RGB_MAX = 255;
        component.ngAfterViewInit();
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(RGB_MAX);
        expect(topLeftPixelColor[1]).toBe(RGB_MAX);
        expect(topLeftPixelColor[2]).toBe(RGB_MAX);
    });
    it('onMouseDown draws the palette', () => {
        const RGB_MAX = 255;
        const clickEvent = new MouseEvent('mousedown');
        component.onMouseDown(clickEvent);
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(RGB_MAX);
        expect(topLeftPixelColor[1]).toBe(RGB_MAX);
        expect(topLeftPixelColor[2]).toBe(RGB_MAX);
    });
    it('onMouseMove draws the palette', () => {
        const RGB_MAX = 255;
        const moveEvent = new MouseEvent('mousemove');
        component.onMouseMove(moveEvent);
        const topLeftPixelColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topLeftPixelColor[0]).toBe(RGB_MAX);
        expect(topLeftPixelColor[1]).toBe(RGB_MAX);
        expect(topLeftPixelColor[2]).toBe(RGB_MAX);
    });
    it('ngOnChanges draws the palette when the hue is changed', () => {
        expect(false).toBeTruthy();
    });
});
