import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';

export const MINIMUM_WIDTH = 250;
export const MINIMUM_HEIGHT = 250;

export const LOWER_BOUND_WIDTH = 500;
export const LOWER_BOUND_HEIGHT = 500;

export const SIDEBAR_WIDTH = 294;

export const enum Status {
    OFF = 0,
    MIDDLE_BOTTOM_RESIZE = 1,
    BOTTOM_RIGHT_RESIZE = 2,
    MIDDLE_RIGHT_RESIZE = 3,
}

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService extends Tool {
    status: Status;
    canvasPreviewWidth: number;
    canvasPreviewHeight: number;

    constructor(drawingService: DrawingService, mouseService: MouseHandlerService) {
        super(drawingService, mouseService);
        this.status = Status.OFF;
    }

    static calculateWorkingZoneSize(): Coordinate {
        return {
            x: window.innerWidth - SIDEBAR_WIDTH,
            y: window.innerHeight,
        };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseService.onMouseDown(this.mouseService.eventToCoordinate(event));
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseService.onMouseUp(this.mouseService.eventToCoordinate(event));
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseService.onMouseMove(this.mouseService.eventToCoordinate(event));
        if (this.isResizing()) this.resizePreviewCanvas();
    }

    onMiddleRightResizerClick(): void {
        console.log('midd right resizer dragged!');
        this.setStatus(Status.MIDDLE_RIGHT_RESIZE);
    }

    onBottomRightResizerClick(): void {
        console.log('right resizer clicked!');
        this.setStatus(Status.BOTTOM_RIGHT_RESIZE);
    }

    onMiddleBottomResizerClick(): void {
        console.log('bott right resizer clicked!');
        this.setStatus(Status.MIDDLE_BOTTOM_RESIZE);
    }

    calculateNewCanvasSize(canvasSize: Coordinate): Coordinate {
        const deltaX = this.mouseService.calculateDeltaX();
        const deltaY = this.mouseService.calculateDeltaY();
        let newCoordinate = { x: canvasSize.x, y: canvasSize.y };

        switch (this.status) {
            case Status.MIDDLE_RIGHT_RESIZE:
                newCoordinate.x += deltaX;
                break;

            case Status.MIDDLE_BOTTOM_RESIZE:
                newCoordinate.y += deltaY;
                break;

            case Status.BOTTOM_RIGHT_RESIZE:
                newCoordinate = { x: canvasSize.x + deltaX, y: canvasSize.y + deltaY };
                break;
        }
        if (newCoordinate.x < MINIMUM_WIDTH) newCoordinate.x = MINIMUM_WIDTH;
        if (newCoordinate.y < MINIMUM_HEIGHT) newCoordinate.y = MINIMUM_HEIGHT;

        return newCoordinate;
    }

    calculateCanvasSize(): Coordinate {
        const workingZone: Coordinate = CanvasResizerService.calculateWorkingZoneSize();
        console.log(workingZone);
        const newWidth = workingZone.x / 2;
        const newHeight = workingZone.y / 2;
        let newCoordinate: Coordinate = { x: newWidth, y: newHeight };

        console.log('newWidth = ' + newWidth);
        if (workingZone.x < LOWER_BOUND_WIDTH || workingZone.y < LOWER_BOUND_HEIGHT) {
            newCoordinate = { x: MINIMUM_WIDTH, y: MINIMUM_HEIGHT };
        }
        return newCoordinate;
    }

    resizePreviewCanvas(): void {
        switch (this.status) {
            case Status.MIDDLE_RIGHT_RESIZE:
                this.canvasPreviewWidth = this.mouseService.currentCoordinate.x - SIDEBAR_WIDTH;
                break;

            case Status.MIDDLE_BOTTOM_RESIZE:
                this.canvasPreviewHeight = this.mouseService.currentCoordinate.y;
                break;

            case Status.BOTTOM_RIGHT_RESIZE:
                this.canvasPreviewWidth = this.mouseService.currentCoordinate.x - SIDEBAR_WIDTH;
                this.canvasPreviewHeight = this.mouseService.currentCoordinate.y;
                break;
        }
    }

    isResizing(): boolean {
        return this.status !== Status.OFF;
    }

    setStatus(status: Status): void {
        this.status = status;
    }
}
