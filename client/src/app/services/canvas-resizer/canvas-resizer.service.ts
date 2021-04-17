import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { LOWER_BOUND_HEIGHT, LOWER_BOUND_WIDTH, MINIMUM_HEIGHT, MINIMUM_WIDTH, SIDEBAR_WIDTH } from '@app/services/services-constants';
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

    constructor(mouseService: MouseHandlerService) {
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

    calculateNewCanvasSize(canvasSize: Vec2): Vec2 {
        // console.log('calculate new Canvas Size called');
        const deltaX = this.mouseService.calculateDeltaX();
        const deltaY = this.mouseService.calculateDeltaY();
        let newCoordinate = { x: Math.round(canvasSize.x), y: Math.round(canvasSize.y) };

        switch (this.status) {
            case Status.MIDDLE_RIGHT_RESIZE:
                newCoordinate.x += Math.round(deltaX);
                break;

            case Status.MIDDLE_BOTTOM_RESIZE:
                newCoordinate.y += Math.round(deltaY);
                break;

            case Status.BOTTOM_RIGHT_RESIZE:
                newCoordinate = { x: Math.round(canvasSize.x + deltaX), y: Math.round(canvasSize.y + deltaY) };
                break;
        }
        if (newCoordinate.x < MINIMUM_WIDTH) newCoordinate.x = MINIMUM_WIDTH;
        if (newCoordinate.y < MINIMUM_HEIGHT) newCoordinate.y = MINIMUM_HEIGHT;

        return newCoordinate;
    }

    calculateCanvasSize(): Vec2 {
        // console.log('calculate Canvas Size called');
        const workingZone: Vec2 = this.calculateWorkingZoneSize();
        const newWidth = Math.round(workingZone.x / 2);
        const newHeight = Math.round(workingZone.y / 2);
        const newCoordinate: Vec2 = { x: newWidth, y: newHeight };

        if (workingZone.x < LOWER_BOUND_WIDTH) newCoordinate.x = MINIMUM_WIDTH;
        if (workingZone.y < LOWER_BOUND_HEIGHT) newCoordinate.y = MINIMUM_HEIGHT;
        return newCoordinate;
    }

    calculateWorkingZoneSize(): Vec2 {
        return {
            x: window.innerWidth - SIDEBAR_WIDTH,
            y: window.innerHeight,
        };
    }

    resizePreviewCanvas(): void {
        switch (this.status) {
            case Status.MIDDLE_RIGHT_RESIZE:
                this.canvasPreviewWidth = Math.round(this.mouseService.currentCoordinate.x - SIDEBAR_WIDTH);
                break;

            case Status.MIDDLE_BOTTOM_RESIZE:
                this.canvasPreviewHeight = Math.round(this.mouseService.currentCoordinate.y);
                break;

            case Status.BOTTOM_RIGHT_RESIZE:
                this.canvasPreviewWidth = Math.round(this.mouseService.currentCoordinate.x - SIDEBAR_WIDTH);
                this.canvasPreviewHeight = Math.round(this.mouseService.currentCoordinate.y);
                break;
        }
        if (this.canvasPreviewWidth < MINIMUM_WIDTH) this.canvasPreviewWidth = MINIMUM_WIDTH;
        if (this.canvasPreviewHeight < MINIMUM_HEIGHT) this.canvasPreviewHeight = MINIMUM_HEIGHT;
    }

    updatePreviewCanvasSize(newCoordinate: Vec2): void {
        // console.log('update preview canvas called');

        this.canvasPreviewHeight = newCoordinate.y;
        this.canvasPreviewWidth = newCoordinate.x;
    }
}
