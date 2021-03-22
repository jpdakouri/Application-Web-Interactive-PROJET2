import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selectionEllipse-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selectionRectangle-service/selection-rectangle.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class SelectionCommand implements ToolCommand {
    readonly tool: SelectionRectangleService | SelectionEllipseService;
    readonly selectionInitialPosition: Vec2;
    readonly selectionFinalPosition: Vec2;
    readonly displacement: Vec2;
    constructor(
        tool: SelectionRectangleService | SelectionEllipseService,
        selectionInitialPosition: Vec2,
        selectionFinalPosition: Vec2,
        displacement: Vec2,
    ) {
        this.tool = tool;
        this.selectionInitialPosition = selectionInitialPosition;
        this.selectionFinalPosition = selectionFinalPosition;
        this.displacement = displacement;
    }
}
