import { Vec2 } from '@app/classes/vec2';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class StampCommand implements ToolCommand {
    readonly tool: StampService;
    readonly scalingFactor: number;
    readonly rotationAngle: number;
    readonly center: Vec2;
    constructor(tool: StampService, scalingFactor: number, rotationAngle: number, center: Vec2) {
        this.tool = tool;
        this.scalingFactor = scalingFactor;
        this.rotationAngle = rotationAngle;
        this.center = center;
    }
}
