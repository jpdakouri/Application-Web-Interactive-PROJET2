import { Tool } from '@app/classes/tool';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';

export interface ToolCommand {
    tool: Tool | CanvasResizerService;
}
