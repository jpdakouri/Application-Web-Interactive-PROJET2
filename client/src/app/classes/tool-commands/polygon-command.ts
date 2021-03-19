import { PolygonService } from '@app/services/tools/polygon-service/polygon.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class PolygonCommand implements ToolCommand {
    tool: PolygonService;
    primaryColor: string;
    secondaryColor: string;
    numberOfSides: number;
    shapeStyle: ShapeStyle;
    strokeThickness: number;

    constructor(
        tool: PolygonService,
        primaryColor: string,
        secondaryColor: string,
        numberOfSides: number,
        shapeStyle: ShapeStyle,
        strokeThickness: number,
    ) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.numberOfSides = numberOfSides;
        this.shapeStyle = shapeStyle;
        this.strokeThickness = strokeThickness;
    }
}
