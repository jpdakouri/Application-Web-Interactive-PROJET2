import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { LineService } from '@app/services/tools/line-service/line.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class LineCommand implements ToolCommand {
    readonly tool: Tool;
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly strokeThickness: number;
    readonly dotThickness: number;
    readonly dotShown: boolean;
    readonly strokePath: Vec2[];

    constructor(tool: LineService, primaryColor: string, secondaryColor: string, strokeThickness: number, dotThickness: number, strokePath: Vec2[]) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.strokeThickness = strokeThickness;
        this.dotThickness = dotThickness;
        this.strokePath = strokePath;
    }
}
