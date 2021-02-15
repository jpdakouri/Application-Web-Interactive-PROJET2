//////////////////////////////////////
//    Inspiré des notes de cours
/////////////////////////////////////

import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;
    let starPosition: Vec2;
    let endPosition: Vec2;

    // We have no dependencies to other classes or Angular Components
    // but we can still let Angular handle the objet creation
    beforeEach(() => TestBed.configureTestingModule({}));

    // This runs before each test so we put variables we reuse here
    beforeEach(() => {
        service = TestBed.inject(MouseHandlerService);
        starPosition = { x: 0, y: 0 };
        endPosition = { x: 3, y: 4 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should read the mouse pointer position', () => {
        // Our setup is already done in the beforeEach()

        service.onMouseDown(starPosition);

        expect(service.startCoordinate.x).toBe(starPosition.x);
        expect(service.startCoordinate.y).toBe(starPosition.y);
    });

    it('onMouseUp should read the mouse pointer position', () => {
        service.onMouseUp(endPosition);

        expect(service.endCoordinate.x).toBe(endPosition.x);
        expect(service.endCoordinate.y).toBe(endPosition.y);
    });

    it('onMouseMove should read the mouse pointer position', () => {
        service.onMouseMove(endPosition);

        expect(service.currentCoordinate.x).toBe(endPosition.x);
        expect(service.currentCoordinate.y).toBe(endPosition.y);
    });

    it('should calculate deltaX between two points', () => {
        starPosition = { x: 3, y: 4 };
        endPosition = { x: 10, y: 10 };
        service.startCoordinate = starPosition;
        service.endCoordinate = endPosition;
        const deltaX = 7;

        const calculatedDeltaX = service.calculateDeltaX();
        expect(calculatedDeltaX).toBe(deltaX);
    });

    it('should calculate deltaY between two points', () => {
        starPosition = { x: 5, y: 5 };
        endPosition = { x: 10, y: 10 };
        service.startCoordinate = starPosition;
        service.endCoordinate = endPosition;
        const deltaY = 5;

        const calculatedDeltaY = service.calculateDeltaY();
        expect(calculatedDeltaY).toBe(deltaY);
    });

    it('should get event coordinate when eventToCoordinate method is called ', () => {
        const mockClick = new MouseEvent('mousemove', {
            clientX: 1,
            clientY: 2,
        });

        const calculatedCoordinate = service.eventToCoordinate(mockClick);
        expect(calculatedCoordinate.x).toBe(1);
        expect(calculatedCoordinate.y).toBe(2);
    });
});
