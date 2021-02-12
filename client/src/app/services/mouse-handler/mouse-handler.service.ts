//////////////////////////////////////
//    Inspiré des notes de cours
/////////////////////////////////////

import { Injectable } from '@angular/core';
import { Coordinate } from './coordinate';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    startCoordinate: Coordinate;
    endCoordinate: Coordinate;
    currentCoordinate: Coordinate;

    constructor() {
        this.startCoordinate = { x: 0, y: 0 };
        this.endCoordinate = { x: 0, y: 0 };
        this.currentCoordinate = { x: 0, y: 0 };
    }

    onMouseDown(coordinate: Coordinate): void {
        this.startCoordinate = coordinate;
    }

    onMouseUp(coordinate: Coordinate): void {
        this.endCoordinate = coordinate;
    }

    onMouseMove(coordinateClick: Coordinate): void {
        this.currentCoordinate = coordinateClick;
    }

    calculateDeltaX(): number {
        return this.endCoordinate.x - this.startCoordinate.x;
    }

    calculateDeltaY(): number {
        return this.endCoordinate.y - this.startCoordinate.y;
    }

    eventToCoordinate(event: MouseEvent): Coordinate {
        return { x: event.clientX, y: event.clientY };
    }
}
