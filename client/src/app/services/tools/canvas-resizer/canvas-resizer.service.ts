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
    constructor(drawingService: DrawingService, mouseService: MouseHandlerService) {
        super(drawingService, mouseService);
        this.status = Status.OFF;
    }
    status: Status;

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
        // if (this.isResizing()) this.resizePreviewCanvas();
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

    isResizing(): boolean {
        return this.status !== Status.OFF;
    }

    setStatus(status: Status): void {
        this.status = status;
    }
}

// resizeCanvas(canvasSize: Coordinate): void {
//     const deltaX = this.mouseService.calculateDeltaX();
//     const deltaY = this.mouseService.calculateDeltaY();
//
//     switch (this.status) {
//         case Status.MIDDLE_RIGHT_RESIZE:
//             canvasSize.x += deltaX;
//             break;
//
//         case Status.MIDDLE_BOTTOM_RESIZE:
//             canvasSize.y += deltaY;
//             break;
//
//         case Status.BOTTOM_RIGHT_RESIZE:
//             canvasSize.x += deltaX;
//             canvasSize.y += deltaY;
//             break;
//     }
//     if (canvasSize.x < MINIMUM_WIDTH) canvasSize.x = MINIMUM_WIDTH;
//     if (canvasSize.y < MINIMUM_HEIGHT) canvasSize.y = MINIMUM_HEIGHT;
//
//     this.drawingService.restoreCanvas();
// }

// @HostListener('window:mouseleave', ['$event'])
// oneMouseLeave(event: MouseEvent): void {
//     this.mouseService.onMouseLeave(this.mouseService.eventToCoordinate(event));
// }

// resizePreviewCanvas(): void {
//     const elem = document.getElementById('rsz');
//     const deltaX = this.mouseService.startCoordinate.x - this.mouseService.currentCoordinate.x;
//     const deltaY = this.mouseService.startCoordinate.y - this.mouseService.currentCoordinate.y;
//     // @ts-ignore
//     if (elem !== null) {
//         switch (this.status) {
//             case Status.MIDDLE_RIGHT_RESIZE:
//                 elem.style.width += String(deltaX) + 'px';
//                 // console.log('rszP width = ' + elem.style.width);
//                 // console.log('deltaX in rsz = ' + deltaX);
//                 break;
//
//             case Status.MIDDLE_BOTTOM_RESIZE:
//                 elem.style.height += deltaY + 'px';
//                 // console.log('deltaY in rsz = ' + deltaY);
//                 break;
//
//             case Status.BOTTOM_RIGHT_RESIZE:
//                 elem.style.width += deltaX + 'px';
//                 elem.style.height += deltaY + 'px';
//
//                 // console.log('deltaX in rsz = ' + deltaX + ' | deltaY in rsz = ' + deltaY);
//                 break;
//         }
//         // if (Number(elem.style.width) < MINIMUM_WIDTH || Number(elem.style.height) < MINIMUM_HEIGHT) {
//         //     elem.style.width = MINIMUM_WIDTH + 'px';
//         //     elem.style.height = MINIMUM_HEIGHT + 'px';
//         // }
//         // this.drawingService.restoreCanvas();
//     }
// }

// resizeCanvas(width: number, height: number): void {
//     // this.isResizing = true;
//     const deltaX = this.mouseService.calculateDeltaX();
//     const deltaY = this.mouseService.calculateDeltaY();
//     console.log('width before resize = ' + width);
//
//     // tslint:disable-next-line:prefer-switch
//     if (this.status === Status.MIDDLE_RIGHT_RESIZE) width += deltaX;
//     else if (this.status === Status.MIDDLE_BOTTOM_RESIZE) height += deltaY;
//     else if (this.status === Status.BOTTOM_RIGHT_RESIZE) {
//         width += deltaX;
//         height += deltaY;
//     }
//     console.log('width after resize = ' + width);
//
//     // console.log('delatX = ' + deltaX);
//     // console.log('delatY = ' + deltaY);
//     this.drawingService.restoreCanvas();
// }
