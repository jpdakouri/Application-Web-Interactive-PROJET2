import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class AerosolCommand implements ToolCommand {
    readonly tool: Tool;
    readonly primaryColor: string;
    readonly particleLocations: Vec2[];
    readonly particleSize: number;

    constructor(tool: AerosolService, primaryColor: string, particleLocations: Vec2[], particleSize: number) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.particleLocations = particleLocations;
        this.particleSize = particleSize;
    }
}
