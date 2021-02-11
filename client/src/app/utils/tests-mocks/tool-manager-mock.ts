import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerServiceMock {
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    currentTool: ToolStub = new ToolStub({} as DrawingService);
    getCurrentToolInstance(): Tool {
        return this.currentTool;
    }
    isCurrentTool(): boolean {
        return true;
    }

    getCurrentLineThickness(): number {
        return 1;
    }
    getCurrentShapeStyle(): ShapeStyle {
        return ShapeStyle.Outline;
    }
    getCurrentDotRadius(): number {
        return 1;
    }
}
