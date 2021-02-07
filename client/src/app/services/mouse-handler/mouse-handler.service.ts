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
    }

    onMouseDown(coordinate: Coordinate): void {
        this.startCoordinate = coordinate;
        console.log('mouse handler onMouse down called!');
    }

    onMouseUp(coordinate: Coordinate): void {
        this.endCoordinate = coordinate;
    }

    onMouseMove(coordinateClick: Coordinate): void {
        this.currentCoordinate = coordinateClick;
    }

    // tslint:disable-next-line:no-empty
    onMouseLeave(coordinate: Coordinate): void {}

    calculateDistanceWrapper(): number {
        const distance = this.calculateDistance(this.startCoordinate, this.endCoordinate);
        return distance;
    }

    calculateDistance(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
        const distanceX = Math.abs(endCoordinate.x - startCoordinate.x);
        const distanceY = Math.abs(endCoordinate.y - startCoordinate.y);

        const totalDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        return totalDistance;
    }

    calculateDeltaX(): number {
        return this.endCoordinate.x - this.startCoordinate.x;
    }

    calculateDeltaY(): number {
        return this.endCoordinate.y - this.startCoordinate.y;
    }

    // private printToConsole(x: number): void {
    //     console.log(`Total distance is ${x}`);
    // }

    eventToCoordinate(event: MouseEvent): Coordinate {
        return { x: event.offsetX, y: event.offsetY };
    }

    // setMouseCoordinate(x: number, y: number): void {
    //     this.currentCoordinate = { x, y };
    // }
}
