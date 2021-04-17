import { Color } from '@app/classes/color';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { PaintBucketService } from '@app/services/tools/paint-bucket-service/paint-bucket.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class BucketCommand implements ToolCommand {
    readonly tool: Tool;
    readonly fillColor: Color;
    readonly startColor: Color;
    readonly bucketTolerance: number;
    readonly isContiguous: boolean;
    readonly mousePosition: Vec2;

    constructor(tool: PaintBucketService, fillColor: Color, startColor: Color, bucketTolerance: number, isContiguous: boolean, mousePosition: Vec2) {
        this.tool = tool;
        this.fillColor = fillColor;
        this.startColor = startColor;
        this.bucketTolerance = bucketTolerance;
        this.isContiguous = isContiguous;
        this.mousePosition = mousePosition;
    }
}
