import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class EraserCommand implements ToolCommand {
    readonly tool: Tool;
    readonly strokeThickness: number;
    readonly strokePath: (Vec2 | undefined)[];

    constructor(tool: EraserService, thickness: number, strokePath: (Vec2 | undefined)[]) {
        this.tool = tool;
        this.strokeThickness = thickness;
        this.strokePath = strokePath;
    }
}
