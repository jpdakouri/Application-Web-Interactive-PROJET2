import { EventEmitter } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolsNames } from '@app/enums/tools-names';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolStub } from '@app/tests-mocks/tool-stub';

export class ToolManagerServiceMock {
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    currentTool: ToolStub = new ToolStub({} as DrawingService);
    getCurrentToolInstance(): Tool {
        return this.currentTool;
    }
}
