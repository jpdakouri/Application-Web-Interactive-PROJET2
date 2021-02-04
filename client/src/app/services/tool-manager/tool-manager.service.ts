import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ShapeStyle } from '@app/enums/shape-style';
import { ToolsNames } from '@app/enums/tools-names';
import { PencilService } from '@app/services/tools/pencil.service';
import { CurrentAttributes } from '@app/types/current-attributes';
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
    currentAttributes: CurrentAttributes;
    shapeStyleSelection: Map<string, ShapeStyle> = new Map<string, ShapeStyle>();

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
        this.currentAttributes = {
            LineThickness: 1,
            PrimaryColor: '#000000',
            SecondaryColor: '#000000',
            ShapeStyle: ShapeStyle.Outline,
        };
        this.shapeStyleSelection.set('Outline', ShapeStyle.Outline).set('Filled', ShapeStyle.Filled).set('FilledOutline', ShapeStyle.FilledOutline);
        this.toolChangeEmitter.subscribe(() => {
            const currentTool = this.toolBox[this.currentTool];
            this.currentAttributes.PrimaryColor = currentTool.primaryColor;
            this.currentAttributes.SecondaryColor = currentTool.secondaryColor;
            this.currentAttributes.ShapeStyle = currentTool.shapeStyle;
            this.currentAttributes.LineThickness = currentTool.lineThickness;
        });
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.currentTool = toolName;
    }

    setCurrentLineThickness(lineThickness?: number): void {
        this.toolBox[this.currentTool].lineThickness = this.currentAttributes.LineThickness = lineThickness
            ? lineThickness
            : this.currentAttributes.LineThickness;
    }
    getCurrentLineThickness(): number | undefined {
        return this.currentAttributes.LineThickness;
    }

    setCurrentPrimaryColor(color: string): void {
        this.toolBox[this.currentTool].primaryColor = this.currentAttributes.PrimaryColor = color;
    }
    getCurrentPrimaryColor(): string | undefined {
        return this.currentAttributes.PrimaryColor;
    }
    setCurrentSecondaryColor(color: string): void {
        this.toolBox[this.currentTool].secondaryColor = this.currentAttributes.SecondaryColor = color;
    }
    getCurrentSecondaryColor(): string | undefined {
        return this.currentAttributes.SecondaryColor;
    }
    setCurrentShapeStyle(shapeStyleStr: string): void {
        const shapeStyle = this.shapeStyleSelection.get(shapeStyleStr);
        this.toolBox[this.currentTool].shapeStyle = this.currentAttributes.ShapeStyle = shapeStyle ? shapeStyle : this.currentAttributes.ShapeStyle;
    }
    getCurrentShapeStyle(): ShapeStyle | undefined {
        return this.currentAttributes.ShapeStyle;
    }

    getCurrentToolInstance(): Tool {
        return this.toolBox[this.currentTool];
    }

    isCurrentTool(toolName: ToolsNames): boolean {
        return this.currentTool === toolName;
    }

    emitToolChange(toolName: ToolsNames): void {
        this.toolChangeEmitter.emit(toolName);
    }
}
