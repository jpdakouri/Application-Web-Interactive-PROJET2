import { EventEmitter } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ShapeStyle } from '@app/enums/shape-style';
import { ToolsNames } from '@app/enums/tools-names';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolStub } from '@app/tests-mocks/tool-stub';

export class ToolManagerServiceMock {
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    currentTool: ToolStub = new ToolStub({} as DrawingService, {} as CurrentColourService);
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

    emitToolChange(): void {}

    setCurrentTool(): void {}
    getCurrentDotRadius(): void {}
}
