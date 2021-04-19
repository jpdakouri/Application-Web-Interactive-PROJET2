import { Injectable } from '@angular/core';
import { LineCommand } from '@app/classes/tool-commands/line-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCreatorService } from '@app/services/tools/line-creator/line-creator.service';
import { DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends LineCreatorService {
    private undoRedo: UndoRedoService;

    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, undoRedo: UndoRedoService) {
        super(drawingService, currentColorService);
        this.undoRedo = undoRedo;
    }

    // Unused inherited functions
    registerUndo(imageData: ImageData): void {
        return;
    }

    moveBorderPreview(newPos: Vec2): void {
        return;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.defaultMouseUp(event);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        this.defaultOnMouseMove(event);
    }

    onDblClick(): void {
        this.started = false;
        let closedSegment = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.verifyLastPoint(this.pathData[0])) {
            this.pathData.pop();
            this.pathData.pop();
            closedSegment = true;
        } else if (this.verifyLastPoint(this.pathData[this.pathData.length - 2])) {
            this.pathData.pop();
        }
        this.drawLine(
            this.drawingService.baseCtx,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            closedSegment,
        );
        const command = new LineCommand(
            this,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            closedSegment,
        );
        this.undoRedo.addCommand(command);
        this.clearPath();
    }

    getPrimaryColor(): string {
        return this.currentColorService.getPrimaryColorHex();
    }

    executeCommand(command: LineCommand): void {
        this.drawLine(
            this.drawingService.baseCtx,
            command.primaryColor,
            command.secondaryColor,
            command.dotShown,
            command.dotThickness,
            command.strokePath,
            command.strokeThickness,
            command.isClosedLoop,
        );
    }
}
