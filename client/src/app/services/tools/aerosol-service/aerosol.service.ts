import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AerosolCommand } from '@app/classes/tool-commands/aerosol-command';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
    }

    executeCommand(command: AerosolCommand): void {
        // TODO
        return;
    }
}
