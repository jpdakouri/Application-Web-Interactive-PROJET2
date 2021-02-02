import { ShapeStyle } from '@app/enums/shape-style';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    currentLineThickness?: number = 1;
    currentPrimaryColor?: string = '#000000';
    currentSecondaryColor?: string = '#000000';
    currentShapeStyle?: ShapeStyle = ShapeStyle.Outline;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    updateAttributesManager(): void {}
}
