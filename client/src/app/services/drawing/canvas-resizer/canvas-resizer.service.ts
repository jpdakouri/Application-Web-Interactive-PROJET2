import { Injectable } from '@angular/core';
import { Coordinate } from '@app/classes/coordinate';
import { LOWER_BOUND_HEIGHT, LOWER_BOUND_WIDTH, MINIMUM_HEIGHT, MINIMUM_WIDTH, SIDEBAR_WIDTH } from '@app/services/drawing/drawing-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { Status } from '@app/utils/enums/canvas-resizer-status';
export * from '@app/utils/enums/canvas-resizer-status';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    status: Status;
    canvasPreviewWidth: number;
    canvasPreviewHeight: number;
    private mouseService: MouseHandlerService;

    constructor(drawingService: DrawingService, mouseService: MouseHandlerService) {
        this.status = Status.OFF;
        this.canvasPreviewWidth = 0;
        this.canvasPreviewHeight = 0;
        this.mouseService = mouseService;
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

    isResizing(): boolean {
        return this.status !== Status.OFF;
    }

    setStatus(status: Status): void {
        this.status = status;
    }

    onMiddleRightResizerClick(): void {
        this.setStatus(Status.MIDDLE_RIGHT_RESIZE);
    }

    onBottomRightResizerClick(): void {
        this.setStatus(Status.BOTTOM_RIGHT_RESIZE);
    }

    onMiddleBottomResizerClick(): void {
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
        const workingZone: Coordinate = this.calculateWorkingZoneSize();
        const newWidth = workingZone.x / 2;
        const newHeight = workingZone.y / 2;
        const newCoordinate: Coordinate = { x: newWidth, y: newHeight };

        if (workingZone.x < LOWER_BOUND_WIDTH) newCoordinate.x = MINIMUM_WIDTH;
        if (workingZone.y < LOWER_BOUND_HEIGHT) newCoordinate.y = MINIMUM_HEIGHT;
        return newCoordinate;
    }

    calculateWorkingZoneSize(): Coordinate {
        return {
            x: window.innerWidth - SIDEBAR_WIDTH,
            y: window.innerHeight,
        };
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

        if (this.canvasPreviewWidth < MINIMUM_WIDTH) this.canvasPreviewWidth = MINIMUM_WIDTH;
        if (this.canvasPreviewHeight < MINIMUM_HEIGHT) this.canvasPreviewHeight = MINIMUM_HEIGHT;
    }
}