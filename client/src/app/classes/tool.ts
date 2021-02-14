import { Injectable } from '@angular/core';
import { ShapeStyle } from '@app/enums/shape-style';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
@Injectable({
    providedIn: 'root',
})
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    lineThickness?: number = 1;
    primaryColor?: string = '#ff0000';
    secondaryColor?: string = '#000000';
    shapeStyle?: ShapeStyle = ShapeStyle.Outline;
    dotRadius?: number = 5;
    showDots?: boolean = false;
    mouseMoved: boolean = false;
    eraserActive?: boolean = false;
    // shiftDown: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onDblClick(event: MouseEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return {
            x: event.x - this.drawingService.canvas.getBoundingClientRect().left,
            y: event.y - this.drawingService.canvas.getBoundingClientRect().top,
        };
    }

    updateAttributesManager(): void {}
}
