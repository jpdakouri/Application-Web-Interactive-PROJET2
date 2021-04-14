import { Vec2 } from '@app/classes/vec2';
export class MousePositionHandlerMock {
    // tslint:disable-next-line:no-empty
    constructor() {}

    isMouseInFirstQuadrant(mouseDownCoord: Vec2): boolean {
        return true;
    }

    isMouseInSecondQuadrant(mouseDownCoord: Vec2): boolean {
        return true;
    }

    isMouseInThirdQuadrant(mouseDownCoord: Vec2): boolean {
        return true;
    }

    isMouseInFourthQuadrant(mouseDownCoord: Vec2): boolean {
        return true;
    }
    isXGreaterThanY(mouseDownCoord: Vec2): boolean {
        return true;
    }

    isYGreaterThanX(mouseDownCoord: Vec2): boolean {
        return true;
    }

    makeCircle(mouseDownCoord: Vec2, grid: Vec2): void {
        return;
    }

    makeSquare(mouseDownCoord: Vec2, grid: Vec2): void {
        return;
    }
}
