import { HostListener, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';

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

    constructor(drawingService: DrawingService, mouseService: MouseHandlerService) {
        super(drawingService, mouseService);
        this.status = Status.OFF;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseService.onMouseDown(this.mouseService.eventToCoordinate(event));
        if (this.status !== Status.OFF) {
            // this.currentTool = this.tools[1];
        }
        // console.log('Canvas resizer onMouse down called!');
        // console.log('mouse down in cRS');
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseService.onMouseUp(this.mouseService.eventToCoordinate(event));

        //     if (this.isResizing()) this.resizeCanvas(this.drawingService.canvas.width, this.drawingService.canvas.height);
        //     this.status = Status.OFF;
        //     this.drawingService.saveCanvas(this.drawingService.canvas.width, this.drawingService.canvas.height);
        //
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseService.onMouseMove(this.mouseService.eventToCoordinate(event));
    }

    @HostListener('window:mouseleave', ['$event'])
    oneMouseLeave(event: MouseEvent): void {
        // this.drawingService.saveCanvas(this.width, this.height);
        // this.isResizing = false;
        this.mouseService.onMouseLeave(this.mouseService.eventToCoordinate(event));
    }

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

    isResizing(): boolean {
        return this.status !== Status.OFF;
    }

    setStatus(status: Status): void {
        this.status = status;
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
}
