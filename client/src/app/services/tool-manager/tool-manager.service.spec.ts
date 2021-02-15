import { TestBed } from '@angular/core/testing';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { AerosolService, ToolManagerService } from './tool-manager.service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let aerosolServiceSpy: jasmine.SpyObj<AerosolService>;
    let eraserServiceSpy: jasmine.SpyObj<EraserService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    beforeEach(() => {
        lineServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        rectangleServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        ellipseServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        pencilServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        aerosolServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        eraserServiceSpy = jasmine.createSpyObj('LineService', ['onMouseMove']);
        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: AerosolService, useValue: aerosolServiceSpy },
                { provide: EraserService, useValue: eraserServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
            ],
        });
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#constructor should have initialized the toolbox property', () => {
        expect(service.toolBox.Pencil).toEqual(pencilServiceSpy);
        expect(service.toolBox.Rectangle).toEqual(rectangleServiceSpy);
        expect(service.toolBox.Ellipse).toEqual(ellipseServiceSpy);
        expect(service.toolBox.Eraser).toEqual(eraserServiceSpy);
        expect(service.toolBox.Line).toEqual(lineServiceSpy);
        expect(service.toolBox.Aerosol).toEqual(aerosolServiceSpy);
    });

    it('#constructor should have initialized the currentAttributes property', () => {
        expect(service.currentAttributes.DotRadius).toEqual(1);
        expect(service.currentAttributes.LineThickness).toEqual(1);
        expect(service.currentAttributes.ShapeStyle).toEqual(ShapeStyle.Outline);
        expect(service.currentAttributes.ShowDots).toEqual(false);
    });
    it('#constructor should have initialized the shapeStyleSelection', () => {
        expect(service.shapeStyleSelection.has('Outline')).toEqual(true);
        expect(service.shapeStyleSelection.has('Filled')).toEqual(true);
        expect(service.shapeStyleSelection.has('FilledOutline')).toEqual(true);
    });

    it('#setCurrentTool should set current tool name', () => {
        service.setCurrentTool(ToolsNames.Aerosol);
        expect(service.currentTool).toEqual(ToolsNames.Aerosol);
        expect(service.currentTool).not.toEqual(ToolsNames.Pencil);
    });
    it("#setCurrentLineThickness should set currentAttributes.lineThickness property and currentTool's line thickness to correct value ", () => {
        const FAKE_LINE_THICKNESS = 10;
        const WRONG_FAKE_LINE_THICKNESS = 5;
        service.setCurrentLineThickness(FAKE_LINE_THICKNESS);
        expect(service.currentAttributes.LineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(service.currentAttributes.LineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
        expect(service.toolBox[service.currentTool].lineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(service.toolBox[service.currentTool].lineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
    });

    it("#getCurrentLineThickness should return currentAttributes property's LineThickness", () => {
        const FAKE_LINE_THICKNESS = 10;
        const WRONG_FAKE_LINE_THICKNESS = 5;
        service.currentAttributes.LineThickness = FAKE_LINE_THICKNESS;
        const lineThickness = service.getCurrentLineThickness();
        expect(lineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(lineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
    });

    it("#setCurrentShowDots should set currentAttributes.showDots property and currentTool's showDots to correct value ", () => {
        const FAKE_SHOW_DOTS = true;
        const WRONG_FAKE_SHOW_DOTS = false;
        service.setCurrentShowDots(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.ShowDots).toEqual(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.ShowDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
        expect(service.toolBox[service.currentTool].showDots).toEqual(FAKE_SHOW_DOTS);
        expect(service.toolBox[service.currentTool].showDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
    });

    it("#setCurrentDotRadius should set currentAttributes.dotRadius property and currentTool's dot radius to correct value ", () => {
        const FAKE_DOT_RADIUS = 10;
        const WRONG_FAKE_DOT_RADIUS = 5;
        service.setCurrentDotRadius(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.DotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.DotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
        expect(service.toolBox[service.currentTool].dotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service.toolBox[service.currentTool].dotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
    });

    it("#getCurrentDotRadius should return currentAttributes property's DotRadius", () => {
        const FAKE_DOT_RADIUS = 10;
        const WRONG_FAKE_DOT_RADIUS = 5;
        service.currentAttributes.DotRadius = FAKE_DOT_RADIUS;
        const dotRadius = service.getCurrentDotRadius();
        expect(dotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(dotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
    });

    it("#setCurrentShapeStyle should set currentAttributes.shapeStyle property and currentTool's shape style to correct value ", () => {
        const FAKE_SHAPE_STYLE = ShapeStyle.Outline;
        const WRONG_FAKE_SHAPE_STYLE = ShapeStyle.Filled;
        service.setCurrentShapeStyle(FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShapeStyle).toEqual(FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShapeStyle).not.toEqual(WRONG_FAKE_SHAPE_STYLE);
        expect(service.toolBox[service.currentTool].shapeStyle).toEqual(FAKE_SHAPE_STYLE);
        expect(service.toolBox[service.currentTool].shapeStyle).not.toEqual(WRONG_FAKE_SHAPE_STYLE);
    });

    it("#getCurrentDotRadius should return currentAttributes property's DotRadius", () => {
        const FAKE_SHAPE_STYLE = ShapeStyle.Outline;
        const WRONG_FAKE_SHAPE_STYLE = ShapeStyle.Filled;
        service.currentAttributes.ShapeStyle = FAKE_SHAPE_STYLE;
        const shapeStyle = service.getCurrentShapeStyle();
        expect(shapeStyle).toEqual(FAKE_SHAPE_STYLE);
        expect(shapeStyle).not.toEqual(WRONG_FAKE_SHAPE_STYLE);
    });

    it('#getCurrentToolInstance should return current tool instance', () => {
        service.currentTool = ToolsNames.Aerosol;
        const currentTool = service.getCurrentToolInstance();
        expect(currentTool).toEqual(service.toolBox[ToolsNames.Aerosol]);
        expect(currentTool).not.toEqual(service.toolBox[ToolsNames.Pencil]);
    });

    it('#isCurrentTool should return true if the paramter is the current tool', () => {
        service.currentTool = ToolsNames.Eraser;
        expect(service.isCurrentTool(ToolsNames.Eraser)).toEqual(true);
        expect(service.isCurrentTool(ToolsNames.Aerosol)).toEqual(false);
    });

    it('#emitToolChange should make the toolChangeEmitter emit the tool name', () => {
        const emitterSpy = spyOn(service.toolChangeEmitter, 'emit').and.callThrough();
        service.emitToolChange(ToolsNames.Rectangle);
        expect(emitterSpy).toHaveBeenCalledWith(ToolsNames.Rectangle);
    });

    it('#emitToolChange should update all currentAttributes values', () => {
        const FAKE_DOT_RADIUS = 5;
        const FAKE_LINE_THICKNESS = 10;
        const FAKE_SHAPE_STYLE = ShapeStyle.Outline;
        const FAKE_SHOW_DOTS = true;
        const WRONG_FAKE_DOT_RADIUS = 15;
        const WRONG_FAKE_LINE_THICKNESS = 20;
        const WRONG_FAKE_SHAPE_STYLE = ShapeStyle.Filled;
        const WRONG_FAKE_SHOW_DOTS = false;
        service.toolBox[ToolsNames.Pencil].dotRadius = WRONG_FAKE_DOT_RADIUS;
        service.toolBox[ToolsNames.Pencil].lineThickness = WRONG_FAKE_LINE_THICKNESS;
        service.toolBox[ToolsNames.Pencil].shapeStyle = WRONG_FAKE_SHAPE_STYLE;
        service.toolBox[ToolsNames.Pencil].showDots = WRONG_FAKE_SHOW_DOTS;
        service.currentTool = ToolsNames.Pencil;
        service.toolBox[ToolsNames.Rectangle].dotRadius = FAKE_DOT_RADIUS;
        service.toolBox[ToolsNames.Rectangle].lineThickness = FAKE_LINE_THICKNESS;
        service.toolBox[ToolsNames.Rectangle].shapeStyle = FAKE_SHAPE_STYLE;
        service.toolBox[ToolsNames.Rectangle].showDots = FAKE_SHOW_DOTS;
        service.emitToolChange(ToolsNames.Rectangle);
        expect(service.currentAttributes.DotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.LineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(service.currentAttributes.ShapeStyle).toEqual(FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShowDots).toEqual(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.DotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
        expect(service.currentAttributes.LineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
        expect(service.currentAttributes.ShapeStyle).not.toEqual(WRONG_FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShowDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
    });
});
