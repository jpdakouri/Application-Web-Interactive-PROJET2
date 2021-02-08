//////////////////////////////////////
//    Inspiré des notes de cours
/////////////////////////////////////

import { TestBed } from '@angular/core/testing';

import { Coordinate } from './coordinate';
import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;
    let starPosition: Coordinate;
    let endPosition: Coordinate;
    let distance: number;

    // We have no dependencies to other classes or Angular Components
    // but we can still let Angular handle the objet creation
    beforeEach(() => TestBed.configureTestingModule({}));

    // This runs before each test so we put variables we reuse here
    beforeEach(() => {
        service = TestBed.inject(MouseHandlerService);
        starPosition = { x: 0, y: 0 };
        endPosition = { x: 3, y: 4 };
        // tslint:disable-next-line:no-magic-numbers
        distance = 5;
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

    it('should calculate distance between two points', () => {
        const calculatedDistance = service.calculateDistance(starPosition, endPosition);

        expect(calculatedDistance).toBe(distance);
    });

    it('should always have a positive or null distance', () => {
        // We can redefine our variables if we need a specific value for the test
        endPosition = { x: -3, y: -4 };

        const calculatedDistance = service.calculateDistance(starPosition, endPosition);
        expect(calculatedDistance).toBeGreaterThanOrEqual(0);
        // Distance should still be the same (5)
        expect(calculatedDistance).toBe(distance);
    });

    it("should calculate a distance of 0 if there's no movement ", () => {
        starPosition = { x: 3, y: 4 };
        distance = 0;

        const calculatedDistance = service.calculateDistance(starPosition, endPosition);
        expect(calculatedDistance).toBe(distance);
    });

    it('should call calculateDistance when wrapper function is called ', () => {
        starPosition = { x: 3, y: 4 };
        service.startCoordinate = starPosition;
        service.endCoordinate = endPosition;

        // We spy on a real function
        const spy = spyOn(service, 'calculateDistance');

        service.calculateDistanceWrapper();

        // Our spy can detect if the wrapper function called calculateDistance
        // It can also check what values have been passed to it
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(service.startCoordinate, service.endCoordinate);
    });

    it('Spy should change what is called when wrapper function is called ', () => {
        service.startCoordinate = starPosition;
        service.endCoordinate = endPosition;

        // We create a fake function that is called instead of printToConsole that does nothing
        // @ts-ignore
        // tslint:disable-next-line:no-empty
        const fakePrint = (x: number) => {};

        // We spy on a real function but replace it with our own one
        // Note : printToConsole is private so we need to add <any> before the spy
        //
        // Using a Spy to mock only a part of an objet can be useful but it should be used with caution.
        // Having to use it a lot can mean that your methods are highly coupled and can have side effets.
        // const spy = spyOn<any>(service, 'printToConsole').and.callFake(fakePrint);

        const calculatedDistance = service.calculateDistanceWrapper();

        // expect(spy).toHaveBeenCalled();
        // tslint:disable-next-line:no-magic-numbers
        expect(calculatedDistance).toBe(5);
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

        service.eventToCoordinate(mockClick);
        expect(mockClick.clientX).toBe(1);
        expect(mockClick.clientY).toBe(2);
    });
});
