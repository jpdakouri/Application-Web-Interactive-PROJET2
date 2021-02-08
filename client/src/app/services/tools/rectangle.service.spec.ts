import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton, RectangleService } from './rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RectangleService);

        mouseEvent = {
            offsetX: 30,
            offsetY: 30,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test Mouse bro', () => {
        const expectedResult: Vec2 = { x: 30, y: 30 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });
});
