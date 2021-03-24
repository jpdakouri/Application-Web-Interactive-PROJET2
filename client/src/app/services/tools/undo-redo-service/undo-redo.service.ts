import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private commands: ToolCommand[];
    private undoneCommands: ToolCommand[];
    private initialCanvasColors: ImageData;

    constructor(private drawingService: DrawingService) {
        this.commands = [];
        this.undoneCommands = [];
    }

    saveInitialState(): void {
        this.initialCanvasColors = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
        );
        this.commands = [];
        this.undoneCommands = [];
    }

    addCommand(command: ToolCommand): void {
        this.commands.push(command);
        this.undoneCommands = [];
    }

    undo(): void {
        if (this.canUndoCommands()) {
            const undoneCommand = this.commands.pop();
            if (undoneCommand !== undefined) this.undoneCommands.push(undoneCommand);
            this.redrawCanvas();
        }
    }

    redo(): void {
        if (this.canRedoCommands()) {
            const redoneCommand = this.undoneCommands.pop();
            if (redoneCommand !== undefined) this.commands.push(redoneCommand);
            this.redrawCanvas();
        }
    }

    canUndoCommands(): boolean {
        return this.commands.length > 0;
    }

    canRedoCommands(): boolean {
        return this.undoneCommands.length > 0;
    }

    private redrawCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        createImageBitmap(this.initialCanvasColors).then((imgBitmap) => {
            this.drawingService.baseCtx.drawImage(imgBitmap, 0, 0);
        });
        this.commands.forEach((command) => {
            command.tool.executeCommand(command);
        });
    }
}
