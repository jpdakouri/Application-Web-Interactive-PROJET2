import { Injectable } from '@angular/core';
import { CanvasOverwriterService } from '@app/services/canvas-overwriter/canvas-overwriter.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_INDEX } from '@app/services/services-constants';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private commands: ToolCommand[];
    private undoneCommands: ToolCommand[];
    private initialCanvasColors: string[][];

    constructor(private drawingService: DrawingService, private overwriter: CanvasOverwriterService) {
        this.commands = [];
        this.undoneCommands = [];
    }

    private saveInitialState(): void {
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;
        this.initialCanvasColors = [];
        for (let i = 0; i < canvasHeight; i++) {
            const currentRow: string[] = [];
            for (let j = 0; j < canvasWidth; j++) {
                currentRow.push(this.getRgbaAtPosition(j, i));
            }
            this.initialCanvasColors.push(currentRow);
        }
    }

    // To be called BEFORE applying changes to the base canvas to save the initial state!
    addCommand(command: ToolCommand): void {
        if (this.initialCanvasColors == undefined) this.saveInitialState();
        this.commands.push(command);
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
        this.overwriter.overwriteCanvasState(this.initialCanvasColors);
        this.commands.forEach((command) => {
            command.tool.executeCommand(command);
        });
    }

    private getRgbaAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2] + rgbaSeperator + imageData[ALPHA_INDEX];
    }
}