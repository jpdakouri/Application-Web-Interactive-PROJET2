import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
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
    private coords: Vec2;
    private moveOffset: Vec2;
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
        this.coords = { x: 0, y: 0 };
        this.moveOffset = { x: 0, y: 0 };
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseService.onMouseDown(this.mouseService.eventToCoordinate(event));
        this.selectionMouseDown = true;
        this.mouseDownCoord = this.coords = this.getPositionFromMouse(event);
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
            const currentCoord = this.getPositionFromMouse(event);
            this.offset.x = this.mouseDownCoord.x - currentCoord.x;
            this.offset.y = this.mouseDownCoord.y - currentCoord.y;
            this.moveOffset.x = this.coords.x - currentCoord.x;
            this.moveOffset.y = this.coords.y - currentCoord.y;
            this.coords = currentCoord;
            if (this.isResizing()) {
                this.resizeSelection();
            }
        }
    }

    isResizing(): boolean {
        return this.status !== SelectionStatus.OFF;
    }

    setStatus(status: SelectionStatus): void {
        switch (status) {
            case SelectionStatus.TOP_LEFT_BOX:
                this.status = SelectionStatus.TOP_LEFT_BOX;
                break;
            case SelectionStatus.TOP_MIDDLE_BOX:
                this.status = SelectionStatus.TOP_MIDDLE_BOX;
                break;
            case SelectionStatus.TOP_RIGHT_BOX:
                this.status = SelectionStatus.TOP_RIGHT_BOX;
                break;
            case SelectionStatus.MIDDLE_RIGHT_BOX:
                this.status = SelectionStatus.MIDDLE_RIGHT_BOX;
                break;
            case SelectionStatus.BOTTOM_RIGHT_BOX:
                this.status = SelectionStatus.BOTTOM_RIGHT_BOX;
                break;
            case SelectionStatus.BOTTOM_MIDDLE_BOX:
                this.status = SelectionStatus.BOTTOM_MIDDLE_BOX;
                break;
            case SelectionStatus.BOTTOM_LEFT_BOX:
                this.status = SelectionStatus.BOTTOM_LEFT_BOX;
                break;
            case SelectionStatus.MIDDLE_LEFT_BOX:
                this.status = SelectionStatus.MIDDLE_LEFT_BOX;
                break;
        }
        this.initialize();
    }

    onMiddleLeftBoxClick(): void {
        this.setStatus(SelectionStatus.MIDDLE_LEFT_BOX);
    }

    private resizeSelection(): void {
        this.drawingService.selectedAreaCtx.canvas.width = this.width + this.offset.x;
        this.drawingService.clearCanvas(this.drawingService.selectedAreaCtx);
        this.topLeftCorner.x = this.initialTopLeftCorner.x - this.moveOffset.x;
        this.drawingService.selectedAreaCtx.canvas.style.left = this.topLeftCorner.x + 'px';
        createImageBitmap(this.imageData).then((imgBitmap) => {
            this.drawingService.selectedAreaCtx.drawImage(
                imgBitmap,
                0,
                0,
                this.drawingService.selectedAreaCtx.canvas.width,
                this.drawingService.selectedAreaCtx.canvas.height,
            );
        });
    }

    private initialize(): void {
        this.width = this.drawingService.selectedAreaCtx.canvas.width;
        this.height = this.drawingService.selectedAreaCtx.canvas.height;
        this.topLeftCorner.x = this.drawingService.selectedAreaCtx.canvas.offsetLeft;
        this.topLeftCorner.y = this.drawingService.selectedAreaCtx.canvas.offsetTop;
        this.initialTopLeftCorner = this.topLeftCorner;
        this.imageData = this.drawingService.selectedAreaCtx.getImageData(0, 0, this.width, this.height);
    }

    updatePreview(): void {
        throw new Error('Method not implemented.');
    }
    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
