import { Vec2 } from '@app/classes/vec2';
import { ClipboardService } from '@app/services/tools/clipboard-service/clipboard.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class ClipboardPasteCommand implements ToolCommand {
    readonly tool: ClipboardService;
    readonly selection: ImageData;
    readonly pasteLocation: Vec2;
    constructor(tool: ClipboardService, selection: ImageData, pasteLocation: Vec2) {
        this.tool = tool;
        this.selection = selection;
        this.pasteLocation = pasteLocation;
    }
}
