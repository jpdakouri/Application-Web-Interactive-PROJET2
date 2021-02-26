import { Tool } from '@app/classes/tool';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
import { Vec2 } from '../vec2';

export class PencilCommand implements ToolCommand {
    readonly tool: Tool;
    readonly primaryColor: string;
    readonly strokeThickness: number;
    readonly strokePath: (Vec2 | undefined)[];

    constructor(tool: Tool, primaryColor: string, strokeThickness: number, strokePath: (Vec2 | undefined)[]) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.strokeThickness = strokeThickness;
        this.strokePath = strokePath;
    }

}
