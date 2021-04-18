import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selection-ellipse-service/selection-ellipse.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class MockSelectionEllipseService extends SelectionEllipseService {
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
