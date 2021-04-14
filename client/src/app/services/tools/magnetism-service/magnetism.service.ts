import { Injectable } from '@angular/core';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends SelectionService {
    isMagnetismActivated: boolean;

    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColorService);
    }

    // onKeyDown(event: KeyboardEvent): void {
    //     this.isMagnetismActivated = true;
    //     switch (event.key) {
    //         case KeyboardButtons.Up: {
    //             this.updateArrowPosition(this.isMagnetismActivated);
    //             break;
    //         }
    //         case KeyboardButtons.Down: {
    //             break;
    //         }
    //         case KeyboardButtons.Right: {
    //             break;
    //         }
    //         case KeyboardButtons.Left: {
    //             break;
    //         }
    //     }
    // }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
    updatePreview(): void {
        throw new Error('Method not implemented.');
    }
}
