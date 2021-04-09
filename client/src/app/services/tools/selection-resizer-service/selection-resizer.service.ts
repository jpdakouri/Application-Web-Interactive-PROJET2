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
    imageData: ImageData;
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
        this.selectionMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.selectionMouseDown) {
            this.mouseService.onMouseMove(this.mouseService.eventToCoordinate(event));
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
        this.initialize();
    }

    private resizeSelection(): void {
        this.drawingService.selectedAreaCtx.canvas.width += 1;
        const rapport = this.drawingService.selectedAreaCtx.canvas.width / this.width;
        this.drawingService.clearCanvas(this.drawingService.selectedAreaCtx);
        this.drawingService.selectedAreaCtx.scale(rapport, 1);
        createImageBitmap(this.imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.drawImage(imgBitmap, this.topLeftCorner.x, this.topLeftCorner.y);
        });
        this.drawingService.selectedAreaCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.topLeftCorner.x -= 1;
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x + 'px';
        // this.drawingService.selectedAreaCtx.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height);
        console.log(rapport);
    }

    private initialize(): void {
        this.width = this.drawingService.selectedAreaCtx.canvas.width;
        this.height = this.drawingService.selectedAreaCtx.canvas.height;
        this.imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
    }

    updatePreview(): void {
        throw new Error('Method not implemented.');
    }
    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
