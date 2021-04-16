import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { SelectionPolygonalLassoService } from './selection-polygonal-lasso.service';

fdescribe('SelectionPolygonalLassoService', () => {
    let service: SelectionPolygonalLassoService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionPolygonalLassoService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getPrimaryColor should return the right color', () => {
        // tslint:disable:no-string-literal
        service['validePoint'] = true;
        // tslint:disable:no-magic-numbers
        service.pathData.length = 3;
        let rep = service.getPrimaryColor();
        expect(rep).toEqual('#000000');
        service['validePoint'] = false;
        service.pathData.length = 3;
        rep = service.getPrimaryColor();
        expect(rep).toEqual('#ff0000');
    });

    it('verifyValideLine should return false if line cross', () => {
        service.pathData.push({ x: 0, y: 0 });
        service.pathData.push({ x: 10, y: 10 });
        service.pathData.push({ x: 10, y: 0 });
        const invalidePoint = { x: 0, y: 10 } as Vec2;
        const rep = service.verifyValideLine(invalidePoint);
        expect(rep).toEqual(false);
    });

    it('verifyValideLine should return true if line dont cross', () => {
        service.pathData.push({ x: 0, y: 0 });
        service.pathData.push({ x: 10, y: 10 });
        service.pathData.push({ x: 10, y: 0 });
        const validePoint = { x: 10, y: 8 } as Vec2;
        const rep = service.verifyValideLine(validePoint);
        expect(rep).toEqual(true);
    });

    it('registerUndo should add a command to undo redo', () => {
        // tslint:disable:no-any
        spyOn<any>(service['undoRedo'], 'addCommand').and.stub();
        service.registerUndo(('' as unknown) as ImageData);
        expect(service['undoRedo'].addCommand).toHaveBeenCalled();
    });

    it('mouseUp should call endOfSelection if it is reached and clip the image', () => {
        service['drawingService'].baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].selectedAreaCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['validePoint'] = true;
        service.mouseDown = true;
        SelectionService.selectionActive = false;
        service.buffer = true;
        service.pathData.push({ x: 0, y: 0 });
        service.pathData.push({ x: 0, y: 10 });
        service.pathData.push({ x: 10, y: 0 });
        service.pathData.push({ x: 0, y: 0 });
        spyOn<any>(service, 'verifyLastPoint').and.returnValue(true);
        spyOn<any>(service, 'endOfSelection').and.callThrough();
        spyOn<any>(service, 'defaultMouseUp').and.stub();
        spyOn<any>(service['drawingService'], 'clearCanvas').and.stub();
        service.onMouseUp({} as MouseEvent);
        expect(service['endOfSelection']).toHaveBeenCalled();
    });

    it('mouseUp should not call endOfSelection if array size is lower than 3', () => {
        spyOn<any>(service, 'endOfSelection').and.stub();
        spyOn<any>(service, 'defaultMouseUp').and.stub();
        service['validePoint'] = true;
        service.mouseDown = true;
        SelectionService.selectionActive = false;
        service.buffer = true;
        service.pathData.push({ x: 0, y: 10 });
        service.pathData.push({ x: 10, y: 0 });
        service.onMouseUp({} as MouseEvent);
        expect(service['endOfSelection']).not.toHaveBeenCalled();
    });

    it('mouseUp should change buffer value if selection was active', () => {
        SelectionService.selectionActive = false;
        service.buffer = false;
        service.onMouseUp({} as MouseEvent);
        expect(service.buffer).toEqual(true);
    });

    it('mouseUp does nothing if buffer and SelectionActive at true ', () => {
        spyOn<any>(service, 'endOfSelection').and.stub();
        SelectionService.selectionActive = false;
        service.buffer = true;
        service.onMouseUp({} as MouseEvent);
        expect(service.buffer).toEqual(true);
        expect(service['endOfSelection']).not.toHaveBeenCalled();
    });

    it('mousMove should upDateDragPosition if it is being draged', () => {
        spyOn<any>(service, 'defaultOnMouseMove').and.stub();
        spyOn<any>(service, 'updateDragPosition').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({} as Vec2);
        service.mouseDown = true;
        SelectionService.selectionActive = true;
        service.dragActive = true;
        service.onMouseMove({} as MouseEvent);
        expect(service.updateDragPosition).toHaveBeenCalled();
    });

    it('mousMove should do nothing if it is not dragged', () => {
        spyOn<any>(service, 'defaultOnMouseMove').and.stub();
        spyOn<any>(service, 'updateDragPosition').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({} as Vec2);
        service.mouseDown = true;
        SelectionService.selectionActive = true;
        service.dragActive = false;
        service.onMouseMove({} as MouseEvent);
        expect(service.updateDragPosition).not.toHaveBeenCalled();
    });
});
