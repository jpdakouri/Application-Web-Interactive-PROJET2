import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ShapeStyle } from '@app/enums/shape-style';
import { ToolsNames } from '@app/enums/tools-names';
import { LineService } from '@app/services/tools/line-service/line.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
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
            DotRadius: 1,
            ShowDots: true,
        };
        this.shapeStyleSelection.set('Outline', ShapeStyle.Outline).set('Filled', ShapeStyle.Filled).set('FilledOutline', ShapeStyle.FilledOutline);
        this.toolChangeEmitter.subscribe(() => {
            const currentTool = this.toolBox[this.currentTool];
            this.currentAttributes.PrimaryColor = currentTool.primaryColor;
            this.currentAttributes.SecondaryColor = currentTool.secondaryColor;
            this.currentAttributes.ShapeStyle = currentTool.shapeStyle;
            this.currentAttributes.LineThickness = currentTool.lineThickness;
            this.currentAttributes.DotRadius = currentTool.dotRadius;
            this.currentAttributes.ShowDots = currentTool.showDots;
        });
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.currentTool = toolName;
    }

    setCurrentLineThickness(lineThickness?: number): void {
        this.toolBox[this.currentTool].lineThickness = lineThickness;
        this.currentAttributes.LineThickness = lineThickness;
    }
    getCurrentLineThickness(): number | undefined {
        return this.currentAttributes.LineThickness;
    }

    setCurrentShowDots(checked: boolean): void {
        this.toolBox[this.currentTool].showDots = checked;
        this.currentAttributes.ShowDots = checked;
    }

    setCurrentDotRadius(dotRadius?: number): void {
        this.toolBox[this.currentTool].dotRadius = dotRadius;
        this.currentAttributes.DotRadius = dotRadius;
    }

    getCurrentDotRadius(): number | undefined {
        return this.currentAttributes.DotRadius;
    }

    setCurrentPrimaryColor(color: string): void {
        this.toolBox[this.currentTool].primaryColor = color;
        this.currentAttributes.PrimaryColor = color;
    }
    getCurrentPrimaryColor(): string | undefined {
        return this.currentAttributes.PrimaryColor;
    }
    setCurrentSecondaryColor(color: string): void {
        this.toolBox[this.currentTool].secondaryColor = color;
        this.currentAttributes.SecondaryColor = color;
    }
    getCurrentSecondaryColor(): string | undefined {
        return this.currentAttributes.SecondaryColor;
    }
    setCurrentShapeStyle(shapeStyleStr: string): void {
        const shapeStyle = this.shapeStyleSelection.get(shapeStyleStr);
        this.toolBox[this.currentTool].shapeStyle = shapeStyle;
        this.currentAttributes.ShapeStyle = shapeStyle;
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
