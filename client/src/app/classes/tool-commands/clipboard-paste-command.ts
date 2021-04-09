import { ClipboardService } from '@app/services/tools/clipboard-service/clipboard.service';
import {Vec2} from '@app/utils/interface/vec2';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class ClipboardPasteCommand implements ToolCommand {
    tool: ClipboardService;
    selection: ImageData;
    pasteLocation: Vec2;
}
