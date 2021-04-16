import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { SelectionPolygonalLassoService } from './selection-polygonal-lasso.service';

fdescribe('SelectionPolygonalLassoService', () => {
    let service: SelectionPolygonalLassoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionPolygonalLassoService);
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
        // tslint:disable-next-line:no-any
        spyOn<any>(service['undoRedo'], 'addCommand').and.stub();
        service.registerUndo(('' as unknown) as ImageData);
        expect(service['undoRedo'].addCommand).toHaveBeenCalled();
    });
});
