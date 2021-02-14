import { Injectable } from '@angular/core';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_COLOR_BLACK, DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { ShapeStyle } from '@app/utils/enums/shape-style';
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
    dotRadius?: number = DEFAULT_DOT_RADIUS;
    showDots?: boolean = false;
    mouseMoved: boolean = false;
    eraserActive?: boolean = false;

    constructor(protected drawingService: DrawingService, protected currentColourService: CurrentColourService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onDblClick(): void {}
    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return {
            x: event.x - this.drawingService.canvas.getBoundingClientRect().left,
            y: event.y - this.drawingService.canvas.getBoundingClientRect().top,
        };
    }

    updateAttributesManager(): void {}
}
