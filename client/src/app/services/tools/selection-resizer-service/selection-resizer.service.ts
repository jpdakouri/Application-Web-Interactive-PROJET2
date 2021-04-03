import { Injectable } from '@angular/core';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizerService {
    status: SelectionStatus;
    private mouseService: MouseHandlerService;
    constructor(mouseService: MouseHandlerService) {
        this.status = SelectionStatus.OFF;
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
        if (this.isResizing()) this.resizeSelection();
    }

    isResizing(): boolean {
        return this.status !== SelectionStatus.OFF;
    }

    setStatus(status: SelectionStatus): void {
        this.status = status;
    }

    onMiddleLeftBoxClick(): void {
        this.setStatus(SelectionStatus.MIDDLE_LEFT_BOX);
        console.log('Ca marche !');
    }

    private resizeSelection(): void {
        console.log('Ca marche !');
    }
}
