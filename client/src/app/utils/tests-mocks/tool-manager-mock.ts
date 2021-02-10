import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '../../classes/tool';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeStyle } from '../../utils/enums/shape-style';
import { ToolsNames } from '../../utils/enums/tools-names';
import { ToolStub } from '../../utils/tests-mocks/tool-stub';

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
