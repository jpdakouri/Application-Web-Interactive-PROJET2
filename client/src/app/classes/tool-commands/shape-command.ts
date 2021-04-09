import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class ShapeCommand implements ToolCommand {
    readonly tool: Tool;
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly strokeThickness: number;
    readonly initialPosition: Vec2;
    readonly finalPosition: Vec2;
    readonly shapeStyle?: ShapeStyle;

    constructor(
        tool: EllipseService | RectangleService,
        primaryColor: string,
        secondaryColor: string,
        strokeThickness: number,
        initialPosition: Vec2,
        finalPosition: Vec2,
        shapeStyle?: ShapeStyle,
    ) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.strokeThickness = strokeThickness;
        this.initialPosition = initialPosition;
        this.finalPosition = finalPosition;
        this.shapeStyle = shapeStyle;
    }
}
