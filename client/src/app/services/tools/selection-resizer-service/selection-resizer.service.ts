import { Injectable } from '@angular/core';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizerService extends SelectionService {
    status: SelectionStatus;
    private mouseService: MouseHandlerService;
    private selectionMouseDown: boolean = false;
    constructor(
        mouseService: MouseHandlerService,
        drawingService: DrawingService,
        currentColorService: CurrentColorService,
        mousePositionHandler: MousePositionHandlerService,
        private undoRedo: UndoRedoService,
    ) {
        super(drawingService, currentColorService, mousePositionHandler, undoRedo);
        this.status = SelectionStatus.OFF;
        this.mouseService = mouseService;
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseService.onMouseDown(this.mouseService.eventToCoordinate(event));
        this.selectionMouseDown = true;
        // LIGNE SUIVANTE A CHANGER, JUSTE LA POUR REGLER UN PROBLEME DE COMPILATION !!!
        this.undoRedo = this.undoRedo;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseService.onMouseUp(this.mouseService.eventToCoordinate(event));
    }

    onMouseMove(event: MouseEvent): void {
        if (this.selectionMouseDown) {
            this.mouseService.onMouseMove(this.mouseService.eventToCoordinate(event));
            this.dragActive = false;
            console.log(this.dragActive, 'dans le resize');
            console.log('on bouge');
            if (this.isResizing()) {
                this.resizeSelection();
            }
        }
    }

    isResizing(): boolean {
        return this.status !== SelectionStatus.OFF;
    }

    setStatus(status: SelectionStatus): void {
        this.status = status;
    }

    onMiddleLeftBoxClick(): void {
        this.setStatus(SelectionStatus.MIDDLE_LEFT_BOX);
        console.log(this.status !== SelectionStatus.OFF);
    }

    private resizeSelection(): void {
        console.log('Ca marche !');
    }

    updatePreview(): void {
        throw new Error('Method not implemented.');
    }
    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
