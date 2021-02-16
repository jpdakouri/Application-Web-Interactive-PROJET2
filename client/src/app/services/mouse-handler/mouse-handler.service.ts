//////////////////////////////////////
//    Inspiré des notes de cours
/////////////////////////////////////

import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    startCoordinate: Vec2;
    endCoordinate: Vec2;
    currentCoordinate: Vec2;

    constructor() {
        this.startCoordinate = { x: 0, y: 0 };
        this.endCoordinate = { x: 0, y: 0 };
        this.currentCoordinate = { x: 0, y: 0 };
    }

    onMouseDown(coordinate: Vec2): void {
        this.startCoordinate = coordinate;
    }

    onMouseUp(coordinate: Vec2): void {
        this.endCoordinate = coordinate;
    }

    onMouseMove(coordinateClick: Vec2): void {
        this.currentCoordinate = coordinateClick;
    }

    calculateDeltaX(): number {
        return this.endCoordinate.x - this.startCoordinate.x;
    }

    calculateDeltaY(): number {
        return this.endCoordinate.y - this.startCoordinate.y;
    }

    eventToCoordinate(event: MouseEvent): Vec2 {
        return { x: event.x, y: event.y };
    }
}
