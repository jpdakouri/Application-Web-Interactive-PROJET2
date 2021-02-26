import { EventEmitter } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';

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
    // tslint:disable:no-empty

    // TODO : Temporary for tests
    getCurrentFrequency(): number {
        return 1;
    }

    getCurrentDropletDiameter(): number {
        return 1;
    }

    getCurrentJetDiameter(): number {
        return 1;
    }

    emitToolChange(): void {}

    setCurrentTool(): void {}
    getCurrentDotRadius(): void {}
}
