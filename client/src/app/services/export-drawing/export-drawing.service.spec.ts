import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let canvasTestHelper: CanvasTestHelper;
    // let link: HTMLAnchorElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportDrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.imageSource = service.canvas.toDataURL('image/png');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be able to apply filter on canvas', () => {
        const filter = ImageFilter.Blur as string;
        const expectedFilterValue = 'blur(5px)' as string;
        service['applyFilterOnCanvas'](filter, service.canvas);
        const context = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        expect(context.filter).toEqual(expectedFilterValue);
    });

    it('should be able to draw image on canvas with filter', () => {
        const image = new Image();
        image.src = service.imageSource;
        const filter = ImageFilter.Sepia as string;
        // const expectedFilterValue = 'blur(5px)' as string;
        // tslint:disable:no-any
        const context = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        const drawImageSpy = spyOn<any>(context, 'drawImage').and.callThrough();
        const applyFilterOnCanvasSpy = spyOn<any>(service, 'applyFilterOnCanvas').and.callThrough();
        service['drawImageOnCanvas'](image, service.canvas, filter);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(applyFilterOnCanvasSpy).toHaveBeenCalled();
        // expect(context.filter).toEqual(expectedFilterValue);
    });
});
