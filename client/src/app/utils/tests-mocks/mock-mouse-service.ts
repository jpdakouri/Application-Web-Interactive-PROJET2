import { Vec2 } from '@app/classes/vec2';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';

export class MockMouseService extends MouseHandlerService {
    deltaX: number = 400;
    deltaY: number = 300;

    startCoordinate: Vec2 = { x: 400, y: 200 };
    currentCoordinate: Vec2 = { x: 600, y: 450 };
    endCoordinate: Vec2 = { x: 500, y: 400 };

    calculateDeltaX = (): number => this.deltaX;
    calculateDeltaY = (): number => this.deltaY;

    // tslint:disable:no-empty
    onMouseDown = (): void => {};
    onMouseUp = (): void => {};
    onMouseMove = (): void => {};
}
