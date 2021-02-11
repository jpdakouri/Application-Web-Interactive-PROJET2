import { Injectable } from '@angular/core';
import { ShapeStyle } from '@app/enums/shape-style';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_COLOR_BLACK, DEFAULT_MIN_THICKNESS, DOT_RADIUS } from '@app/services/tools/tools-constants';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
@Injectable({
    providedIn: 'root',
})
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    lineThickness?: number = DEFAULT_MIN_THICKNESS;
    primaryColor?: string = DEFAULT_COLOR_BLACK;
    secondaryColor?: string = DEFAULT_COLOR_BLACK;
    shapeStyle?: ShapeStyle = ShapeStyle.Outline;
    dotRadius?: number = DOT_RADIUS;
    showDots?: boolean = false;
    mouseMoved: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onDblClick(): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    updateAttributesManager(): void {}
}
