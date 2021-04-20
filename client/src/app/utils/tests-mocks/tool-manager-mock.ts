import { EventEmitter } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text-service/text.service';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { Stamp } from '@app/utils/enums/stamp';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolStub } from '@app/utils/tests-mocks/tool-stub';
export class ToolManagerServiceMock {
    toolChangeEmitter: EventEmitter<ToolsNames> = new EventEmitter<ToolsNames>();
    currentTool: ToolStub = new ToolStub({} as DrawingService, {} as CurrentColorService);
    textService: TextService = new TextService({} as CurrentColorService, {} as DrawingService, {} as UndoRedoService);

    isCurrentTool(): boolean {
        return true;
    }

    getCurrentToolInstance(): Tool {
        return this.currentTool;
    }

    getCurrentTolerance(): number {
        return 0;
    }

    getCurrentLineThickness(): number {
        return 1;
    }
    getCurrentShapeStyle(): ShapeStyle {
        return ShapeStyle.Outline;
    }

    getCurrentFrequency(): number {
        return 1;
    }

    getCurrentDropletDiameter(): number {
        return 1;
    }

    getCurrentJetDiameter(): number {
        return 1;
    }

    getCurrentNumberOfSides(): number {
        return 1;
    }

    emitToolChange(): void {
        return;
    }

    setCurrentTool(): void {
        return;
    }

    getCurrentDotRadius(): void {
        return;
    }

    getStampScalingFactor(): number {
        return 1;
    }

    eraserActive(): boolean {
        return true;
    }

    getSelectedStamp(): Stamp {
        return Stamp.House;
    }

    getCurrentFontSize(): number {
        return 1;
    }

    setStampScalingFactor(): void {
        /*empty*/
    }

    setSelectedStamp(): void {
        /*empty*/
    }
    getCurrentSelectionTool(): undefined {
        return undefined;
    }
    setStampRotationAngle(): void {
        /*empty*/
    }

    getStampRotationAngle(): number {
        return 1;
    }
}
