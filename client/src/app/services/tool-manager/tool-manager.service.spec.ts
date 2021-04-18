import { TestBed } from '@angular/core/testing';
import { AerosolService } from '@app/services/tools/aerosol-service/aerosol.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { SelectionEllipseService } from '@app/services/tools/selection-ellipse-service/selection-ellipse.service';
import { SelectionPolygonalLassoService } from '@app/services/tools/selection-polygonal-lasso/selection-polygonal-lasso.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { Stamp } from '@app/utils/enums/stamp';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { ToolManagerService } from './tool-manager.service';

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
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onMouseMove']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onMouseMove']);
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['onMouseMove']);
        aerosolServiceSpy = jasmine.createSpyObj('AerosolService', ['onMouseMove']);
        eraserServiceSpy = jasmine.createSpyObj('EraserService', ['onMouseMove']);
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
    it("#setCurrentTolerance should set currentAttributes.BucketTolerance property and currentTool's bucketTolerance to correct value ", () => {
        const BUCKET_TOLERANCE = 10;
        const WRONG_BUCKET_TOLERANCE = 5;
        service.setCurrentTolerance(BUCKET_TOLERANCE);
        expect(service.currentAttributes.BucketTolerance).toEqual(BUCKET_TOLERANCE);
        expect(service.currentAttributes.LineThickness).not.toEqual(WRONG_BUCKET_TOLERANCE);
        expect(service.toolBox[service.currentTool].bucketTolerance).toEqual(BUCKET_TOLERANCE);
        expect(service.toolBox[service.currentTool].bucketTolerance).not.toEqual(WRONG_BUCKET_TOLERANCE);
    });

    it("#getCurrentLineThickness should return currentAttributes property's LineThickness", () => {
        const FAKE_LINE_THICKNESS = 10;
        const WRONG_FAKE_LINE_THICKNESS = 5;
        service.currentAttributes.LineThickness = FAKE_LINE_THICKNESS;
        const lineThickness = service.getCurrentLineThickness();
        expect(lineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(lineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
    });

    it("#getCurrentTolerance should return currentAttributes property's BucketTolerance", () => {
        const BUCKET_TOLERANCE = 10;
        const WRONG_BUCKET_TOLERANCE = 5;
        service.currentAttributes.BucketTolerance = BUCKET_TOLERANCE;
        const bucketTolerance = service.getCurrentTolerance();
        expect(bucketTolerance).toEqual(BUCKET_TOLERANCE);
        expect(bucketTolerance).not.toEqual(WRONG_BUCKET_TOLERANCE);
    });

    it("#setCurrentShowDots should set currentAttributes.showDots property and currentTool's showDots to correct value ", () => {
        const FAKE_SHOW_DOTS = true;
        const WRONG_FAKE_SHOW_DOTS = false;
        service.setCurrentTool(ToolsNames.Line);
        service.setCurrentShowDots(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.ShowDots).toEqual(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.ShowDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
        // tslint:disable:no-string-literal
        expect(service['lineService'].showDots).toEqual(FAKE_SHOW_DOTS);
        expect(service['lineService'].showDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
    });

    it("#setCurrentDotRadius should set currentAttributes.dotRadius property and currentTool's dot radius to correct value ", () => {
        const FAKE_DOT_RADIUS = 10;
        const WRONG_FAKE_DOT_RADIUS = 5;
        service.setCurrentTool(ToolsNames.Line);
        service.setCurrentDotRadius(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.DotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.DotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
        expect(service['lineService'].dotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service['lineService'].dotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
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

    it("#getCurrentFrequency should return currentAttributes propert's Frequency", () => {
        const frequency = 10;
        service.currentAttributes.Frequency = frequency;
        const expectedFrequency = service.getCurrentFrequency();
        expect(expectedFrequency).toBe(frequency);
    });

    it("#getCurrentDropletDiameter should return currentAttributes propert's DropletDiameter", () => {
        const dropletDiameter = 10;
        service.currentAttributes.DropletDiameter = dropletDiameter;
        const expectedFrequency = service.getCurrentDropletDiameter();
        expect(expectedFrequency).toBe(dropletDiameter);
    });

    it("#getCurrentJetDiameter should return currentAttributes propert's JetDiameter", () => {
        const jetDiameter = 10;
        service.currentAttributes.JetDiameter = jetDiameter;
        const expectedFrequency = service.getCurrentJetDiameter();
        expect(expectedFrequency).toBe(jetDiameter);
    });

    it('#isCurrentTool should return true if the paramter is the current tool', () => {
        service.currentTool = ToolsNames.Eraser;
        expect(service.isCurrentTool(ToolsNames.Eraser)).toEqual(true);
        expect(service.isCurrentTool(ToolsNames.Aerosol)).toEqual(false);
    });

    it("#setCurrentFrequency should set currentAttributes.Frequency property and currentTool's frequency to correct value ", () => {
        const frequency = 10;
        service.setCurrentFrequency(frequency);
        expect(service.currentAttributes.Frequency).toEqual(frequency);
        expect(service.toolBox[service.currentTool].frequency).toEqual(frequency);
    });

    it("#setCurrentJetDiameter should set currentAttributes.JetDiameter property and currentTool's jetDimater to correct value ", () => {
        const jetDiameter = 10;
        service.setCurrentJetDiameter(jetDiameter);
        expect(service.currentAttributes.JetDiameter).toEqual(jetDiameter);
        expect(service.toolBox[service.currentTool].jetDiameter).toEqual(jetDiameter);
    });

    it("#setCurrentDropletDiameter should set currentAttributes.DropletDiameter property and currentTool's dropletDiameter to correct value ", () => {
        const dropletDiameter = 10;
        service.setCurrentDropletDiameter(dropletDiameter);
        expect(service.currentAttributes.DropletDiameter).toEqual(dropletDiameter);
        expect(service.toolBox[service.currentTool].dropletDiameter).toEqual(dropletDiameter);
    });

    it('#emitToolChange should make the toolChangeEmitter emit the tool name', () => {
        const emitterSpy = spyOn(service.toolChangeEmitter, 'emit').and.callThrough();
        service.emitToolChange(ToolsNames.Rectangle);
        expect(emitterSpy).toHaveBeenCalledWith(ToolsNames.Rectangle);
    });

    it('#emitToolChange should update all currentAttributes shapeStyle and showDots', () => {
        const FAKE_SHAPE_STYLE = ShapeStyle.Outline;
        const FAKE_SHOW_DOTS = true;
        const WRONG_FAKE_SHAPE_STYLE = ShapeStyle.Filled;
        const WRONG_FAKE_SHOW_DOTS = false;
        service.toolBox[ToolsNames.Pencil].shapeStyle = WRONG_FAKE_SHAPE_STYLE;
        service['lineService'].showDots = WRONG_FAKE_SHOW_DOTS;
        service.currentTool = ToolsNames.Pencil;
        service.toolBox[ToolsNames.Rectangle].shapeStyle = FAKE_SHAPE_STYLE;
        service['lineService'].showDots = FAKE_SHOW_DOTS;
        service.emitToolChange(ToolsNames.Rectangle);
        expect(service.currentAttributes.ShapeStyle).toEqual(FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShowDots).toEqual(FAKE_SHOW_DOTS);
        expect(service.currentAttributes.ShapeStyle).not.toEqual(WRONG_FAKE_SHAPE_STYLE);
        expect(service.currentAttributes.ShowDots).not.toEqual(WRONG_FAKE_SHOW_DOTS);
    });

    it('#emitToolChange should update currentAttributes dotRadius and lineThickness', () => {
        const FAKE_DOT_RADIUS = 5;
        const FAKE_LINE_THICKNESS = 10;
        const WRONG_FAKE_DOT_RADIUS = 15;
        const WRONG_FAKE_LINE_THICKNESS = 20;
        service['lineService'].dotRadius = WRONG_FAKE_DOT_RADIUS;
        service.toolBox[ToolsNames.Pencil].lineThickness = WRONG_FAKE_LINE_THICKNESS;
        service.currentTool = ToolsNames.Pencil;
        service['lineService'].dotRadius = FAKE_DOT_RADIUS;
        service.toolBox[ToolsNames.Rectangle].lineThickness = FAKE_LINE_THICKNESS;
        service.emitToolChange(ToolsNames.Rectangle);
        expect(service.currentAttributes.DotRadius).toEqual(FAKE_DOT_RADIUS);
        expect(service.currentAttributes.LineThickness).toEqual(FAKE_LINE_THICKNESS);
        expect(service.currentAttributes.DotRadius).not.toEqual(WRONG_FAKE_DOT_RADIUS);
        expect(service.currentAttributes.LineThickness).not.toEqual(WRONG_FAKE_LINE_THICKNESS);
    });

    it('getStampScalingFactor gets the scaling factor', () => {
        TestBed.inject(StampService).scalingFactor = 2;
        expect(service.getStampScalingFactor()).toBe(2);
    });
    it('getSelectedStamp gets the selected stamp', () => {
        TestBed.inject(StampService).selectedStamp = Stamp.Hashtag;
        expect(service.getSelectedStamp()).toBe(Stamp.Hashtag);
    });
    it('setStampScalingFactor sets the scaling factor', () => {
        const stamp = TestBed.inject(StampService);
        service.setStampScalingFactor(2);
        expect(stamp.scalingFactor).toBe(2);
        service.setStampScalingFactor(undefined);
        expect(stamp.scalingFactor).toBe(2);
    });

    it('setStampRotationAngle sets the scaling factor', () => {
        const stamp = TestBed.inject(StampService);
        service.setStampRotationAngle(2);
        expect(stamp.rotationAngle).toBe(2);
        service.setStampRotationAngle(undefined);
        expect(stamp.rotationAngle).toBe(2);
    });

    it('setSelectedStamp sets the selected stamp', () => {
        const stamp = TestBed.inject(StampService);
        service.setSelectedStamp('house');
        expect(stamp.selectedStamp).toBe(Stamp.House);
        service.setSelectedStamp('letter');
        expect(stamp.selectedStamp).toBe(Stamp.Letter);
        service.setSelectedStamp('smile');
        expect(stamp.selectedStamp).toBe(Stamp.Smile);
        service.setSelectedStamp('hashtag');
        expect(stamp.selectedStamp).toBe(Stamp.Hashtag);
        service.setSelectedStamp('star');
        expect(stamp.selectedStamp).toBe(Stamp.Star);
    });

    it('getCurrentSelectionTool returns current if selection, undefined otherwise', () => {
        service.emitToolChange(ToolsNames.SelectBox);
        expect(service.getCurrentSelectionTool()).toBe(TestBed.inject(SelectionRectangleService));
        service.emitToolChange(ToolsNames.SelectEllipse);
        expect(service.getCurrentSelectionTool()).toBe(TestBed.inject(SelectionEllipseService));
        service.emitToolChange(ToolsNames.SelectPolygon);
        expect(service.getCurrentSelectionTool()).toBe(TestBed.inject(SelectionPolygonalLassoService));
        service.emitToolChange(ToolsNames.Pencil);
        expect(service.getCurrentSelectionTool()).toBe(undefined);
    });

    it('getStampRotationAngle gets the angle of the stamp', () => {
        const tool = TestBed.inject(StampService);
        tool.rotationAngle = 2;
        expect(service.getStampRotationAngle()).toBe(2);
    });

    it('eraserActive should return true if erase active', () => {
        service['eraserService'].isActive = true;
        let retVal = service.eraserActive();
        expect(retVal).toEqual(true);
        service['eraserService'].isActive = false;
        retVal = service.eraserActive();
        expect(retVal).toEqual(false);
    });
});
