import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class AerosolCommand implements ToolCommand {
    readonly tool: Tool;
    readonly primaryColor: string;
    readonly changedPixels: Vec2[];

    constructor(tool: AerosolService, primaryColor: string, changedPixels: Vec2[]) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.changedPixels = changedPixels;
    }
}
