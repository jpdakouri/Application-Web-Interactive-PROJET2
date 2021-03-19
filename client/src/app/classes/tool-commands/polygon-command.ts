import { Vec2 } from '@app/classes/vec2';
import { PolygonService } from '@app/services/tools/polygon-service/polygon.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class PolygonCommand implements ToolCommand {
    readonly tool: PolygonService;
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly numberOfSides: number;
    readonly shapeStyle?: ShapeStyle;
    readonly strokeThickness: number;
    readonly initialPosition: Vec2;
    readonly finalPosition: Vec2;

    constructor(
        tool: PolygonService,
        primaryColor: string,
        secondaryColor: string,
        initialPosition: Vec2,
        finalPosition: Vec2,
        numberOfSides: number,
        strokeThickness: number,
        shapeStyle?: ShapeStyle,
    ) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.initialPosition = initialPosition;
        this.finalPosition = finalPosition;
        this.numberOfSides = numberOfSides;
        this.shapeStyle = shapeStyle;
        this.strokeThickness = strokeThickness;
    }
}
