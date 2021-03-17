import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilCommand } from '@app/classes/tool-commands/pencil-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    currentColourService: CurrentColourService;
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
