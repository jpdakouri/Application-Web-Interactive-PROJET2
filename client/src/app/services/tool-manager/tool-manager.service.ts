import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolsNames } from '../../enums/tools-names';
import { ToolBox } from '../../types/tool-box';
import { PencilService } from '../tools/pencil.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    currentTool: ToolsNames = ToolsNames.Pencil;
    pencilService: PencilService;
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    toolBox: ToolBox;

    constructor(pencilService: PencilService) {
        this.pencilService = pencilService;
        this.toolBox = {
            Pencil: this.pencilService,
        };
    }

    setCurrentTool(toolName: ToolsNames) {
        this.currentTool = toolName;
    }

    getCurrentToolInstance(): Tool {
        return this.toolBox[this.currentTool];
    }
}
