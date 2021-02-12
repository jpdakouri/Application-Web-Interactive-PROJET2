import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerServiceMock {
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    currentTool: ToolStub = new ToolStub({} as DrawingService, {} as CurrentColourService);
    getCurrentToolInstance(): Tool {
        return this.currentTool;
    }
}
