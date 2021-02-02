import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolsNames } from '@app/enums/tools-names';
import { PencilService } from '@app/services/tools/pencil.service';
import { ToolBox } from '@app/types/tool-box';

// tslint:disable: max-classes-per-file
@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {}
@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {}
@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {}
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {}
@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {}
@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    currentTool: ToolsNames = ToolsNames.Pencil;
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    toolBox: ToolBox;

    constructor(
        pencilService: PencilService,
        rectangleService: RectangleService,
        ellipseService: EllipseService,
        lineService: LineService,
        eraserService: EraserService,
        aerosolService: AerosolService,
    ) {
        this.toolBox = {
            Pencil: pencilService,
            Rectangle: rectangleService,
            Ellipse: ellipseService,
            Line: lineService,
            Eraser: eraserService,
            Aerosol: aerosolService,
        };
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.currentTool = toolName;
    }

    getCurrentToolInstance(): Tool {
        return this.toolBox[this.currentTool];
    }

    isCurrentTool(toolName: ToolsNames): boolean {
        return this.currentTool === toolName;
    }
}
