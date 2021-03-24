import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class EraserCommand implements ToolCommand {
    readonly tool: Tool;
    readonly strokeThickness: number;
    readonly strokePaths: Vec2[][];

    constructor(tool: EraserService, thickness: number, strokePaths: Vec2[][]) {
        this.tool = tool;
        this.strokeThickness = thickness;
        this.strokePaths = strokePaths;
    }
}
