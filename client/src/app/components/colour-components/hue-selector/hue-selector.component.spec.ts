import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HueSelectorComponent } from './hue-selector.component';
const RGBA_MAX = 255;
const CANVAS_WIDTH = 40;
const CANVAS_HEIGHT = 200;
describe('HueSelectorComponent', () => {
    let component: HueSelectorComponent;
    let fixture: ComponentFixture<HueSelectorComponent>;
    let canvasContext: CanvasRenderingContext2D;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HueSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HueSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const context = component.sliderCanvas.nativeElement.getContext('2d');
        if (context != null) canvasContext = context;
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('the gradient is drawn correctly', () => {
        const moveEvent = new MouseEvent('mousemove');
        component.onMouseMove(moveEvent);
        const topColor = canvasContext.getImageData(0, 0, 1, 1).data;
        // the selector is drawn at the top of the gradient
        expect(topColor[0]).toBe(RGBA_MAX);
        expect(topColor[1]).toBe(RGBA_MAX);
        expect(topColor[2]).toBe(RGBA_MAX);
        // the bottom of the gradient has a color that is close to pure red
        const bottomColor = canvasContext.getImageData(CANVAS_WIDTH - 1, CANVAS_HEIGHT - 1, 1, 1).data;
        expect(bottomColor[0]).toBe(RGBA_MAX);
        expect(bottomColor[1]).toBe(0);
        const traceOfBlueRgb = bottomColor[2] === 3 || bottomColor[2] === 4 ? true : false;
        expect(traceOfBlueRgb).toBe(true);
    });
    it('the selector does not move if not clicked', () => {
        const moveEvent = new MouseEvent('mousemove', { clientX: 25, clientY: 100 });
        component.onMouseMove(moveEvent);
        const topColor = canvasContext.getImageData(0, 0, 1, 1).data;
        expect(topColor[0]).toBe(RGBA_MAX);
        expect(topColor[1]).toBe(RGBA_MAX);
        expect(topColor[2]).toBe(RGBA_MAX);
    });

    it('the color is emitted if the cursor is on the component canvas', () => {
        spyOn(component.color, 'emit');
        const clickEvent = new MouseEvent('mousedown', { clientX: 25, clientY: 100 });
        component.onMouseDown(clickEvent);
        const moveEvent = new MouseEvent('mousemove', { clientX: 10, clientY: 150 });
        component.onMouseMove(moveEvent);
        expect(component.color.emit).toHaveBeenCalledTimes(2);
    });

    it('the color is not emitted if the cursor is not at a valid position', () => {
        spyOn(component.color, 'emit');
        const clickEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
        component.onMouseDown(clickEvent);
        const moveEvent = new MouseEvent('mousemove', { clientX: 60, clientY: 300 });
        component.onMouseMove(moveEvent);
        expect(component.color.emit).toHaveBeenCalledTimes(0);
    });

    it('after unclicking, a mouse move does not emit a color', () => {
        spyOn(component.color, 'emit');
        const clickEvent = new MouseEvent('mousedown', { clientX: 10, clientY: 10 });
        component.onMouseDown(clickEvent);
        const moveEvent = new MouseEvent('mousemove', { clientX: 30, clientY: 150 });
        component.onMouseMove(moveEvent);
        component.onMouseUp();
        component.onMouseMove(moveEvent);
        expect(component.color.emit).toHaveBeenCalledTimes(2);
    });

    it('When selecting a color, the selector is drawn where the selection is', () => {
        const chosenPosition = 25;
        const selectorGapThickness = 6;
        const clickEvent = new MouseEvent('mousedown', { clientX: 25, clientY: 25 });
        component.onMouseDown(clickEvent);
        const nearbyTopColor = canvasContext.getImageData(chosenPosition, chosenPosition - selectorGapThickness, 1, 1).data;
        expect(nearbyTopColor[0]).toBe(RGBA_MAX);
        expect(nearbyTopColor[1]).toBe(RGBA_MAX);
        expect(nearbyTopColor[2]).toBe(RGBA_MAX);
        const nearbyBottomColor = canvasContext.getImageData(chosenPosition, chosenPosition + selectorGapThickness, 1, 1).data;
        expect(nearbyBottomColor[0]).toBe(RGBA_MAX);
        expect(nearbyBottomColor[1]).toBe(RGBA_MAX);
        expect(nearbyBottomColor[2]).toBe(RGBA_MAX);
    });
});
