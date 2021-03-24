import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selection-ellipse-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class SelectionCommand implements ToolCommand {
    readonly tool: SelectionRectangleService | SelectionEllipseService;
    readonly initialTopLeftCorner: Vec2;
    readonly finalTopLeftCorner: Vec2;
    readonly selectionSize: Vec2;
    readonly imageData: ImageData;
    constructor(
        tool: SelectionRectangleService | SelectionEllipseService,
        initialTopLeftCorner: Vec2,
        finalTopLeftCorner: Vec2,
        selectionSize: Vec2,
        imageData: ImageData,
    ) {
        this.tool = tool;
        this.initialTopLeftCorner = initialTopLeftCorner;
        this.finalTopLeftCorner = finalTopLeftCorner;
        this.selectionSize = selectionSize;
        this.imageData = imageData;
    }
}
