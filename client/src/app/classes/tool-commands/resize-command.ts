import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class ResizeCommand implements ToolCommand {
    readonly tool: CanvasResizerService;
    readonly newWidth: number;
    readonly newHeight: number;

    constructor(tool: CanvasResizerService, newWidth: number, newHeight: number) {
        this.tool = tool;
        this.newWidth = newWidth;
        this.newHeight = newHeight;
    }
}
