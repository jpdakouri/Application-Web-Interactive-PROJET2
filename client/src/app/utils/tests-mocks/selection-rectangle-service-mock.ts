import { Vec2 } from '@app/classes/vec2';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class MockSelectionRectangleService extends SelectionRectangleService {
    topLeftCorner: Vec2 = { x: 0, y: 0 };
    height: number = 0;
    width: number = 0;
    registerUndo(imageData: ImageData): void {
        return;
    }
    updatePreview(): void {
        return;
    }
    executeCommand(command: ToolCommand): void {
        return;
    }
}
