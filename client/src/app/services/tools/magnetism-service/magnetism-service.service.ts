import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class MagnetismServiceService extends Tool {
    isMagnetismActivated: boolean;

    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColorService);
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                break;
            }
            case KeyboardButtons.Down: {
                break;
            }
            case KeyboardButtons.Right: {
                break;
            }
            case KeyboardButtons.Left: {
                break;
            }
        }
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
