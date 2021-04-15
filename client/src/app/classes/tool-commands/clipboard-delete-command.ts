import { Vec2 } from '@app/classes/vec2';
import { ClipboardService } from '@app/services/tools/clipboard-service/clipboard.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class ClipboardDeleteCommand implements ToolCommand {
    readonly tool: ClipboardService; // TODO: changer pour sélection
    readonly selectionPositions: Vec2[];
    constructor(tool: ClipboardService, selectionPositions: Vec2[]) {
        this.tool = tool;
        this.selectionPositions = selectionPositions;
    }
}
