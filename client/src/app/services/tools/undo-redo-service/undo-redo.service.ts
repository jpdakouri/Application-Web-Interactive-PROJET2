import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ALPHA_INDEX } from '@app/services/services-constants';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private commands: ToolCommand[];
    private undoneCommands: ToolCommand[];
    private initialCanvasState: string[][];

    constructor(private drawingService: DrawingService) {
        this.commands = [];
        this.undoneCommands = [];
    }

    private saveInitialState(): void {
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;
        this.initialCanvasState = [];
        for (let i = 0; i < canvasHeight; i++) {
            const currentRow: string[] = [];
            for (let j = 0; j < canvasWidth; j++) {
                currentRow.push(this.getRgbaAtPosition(i, j));
            }
            this.initialCanvasState.push(currentRow);
        }
    }

    // To be called BEFORE applying changes to the base canvas!
    addCommand(command: ToolCommand): void {
        if (this.initialCanvasState == undefined) this.saveInitialState();
        this.commands.push(command);
    }

    undoCommand(): void {
        if (this.canUndoCommands()) {
            const undoneCommand = this.commands.pop();
            if (undoneCommand !== undefined) this.undoneCommands.push(undoneCommand);
        }
        this.redrawCanvas();
    }

    redoCommand(): void {
        if (this.canRedoCommands()) {
            const redoneCommand = this.undoneCommands.pop();
            if (redoneCommand !== undefined) this.commands.push(redoneCommand);
        }
        this.redrawCanvas();
    }

    canUndoCommands(): boolean {
        return this.commands.length > 0;
    }

    canRedoCommands(): boolean {
        return this.undoneCommands.length > 0;
    }

    redrawCanvas(): void {
        // Resize
        // Restaurer état initial
        // tout les commandes
        return;
    }

    private getRgbaAtPosition(x: number, y: number): string {
        const imageData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2] + rgbaSeperator + imageData[ALPHA_INDEX];
    }
}
