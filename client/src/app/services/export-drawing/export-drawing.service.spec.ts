import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let canvasTestHelper: CanvasTestHelper;
    // let link: HTMLAnchorElement;
    let spyLink: jasmine.SpyObj<HTMLAnchorElement>;

    beforeEach(() => {
        spyLink = jasmine.createSpyObj('a', ['click']);
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportDrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.imageSource = service.canvas.toDataURL('image/png');
        service.link = spyLink;
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

    it('#drawImageOnCanvas should not call #applyFilterOnCanvas if filter is undefined', () => {
        const applyFilterOnCanvasSpy = spyOn<any>(service, 'applyFilterOnCanvas').and.stub();
        const image = new Image();
        image.src = service.imageSource;

        service['drawImageOnCanvas'](image, service.canvas);

        expect(applyFilterOnCanvasSpy).not.toHaveBeenCalled();
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
        const whiteColor = '#ffffff' as string;
        service['drawImageOnCanvas'](image, service.canvas, filter);
        expect(context.fillStyle).toBe(whiteColor);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(applyFilterOnCanvasSpy).toHaveBeenCalled();
        // expect(context.filter).toEqual(expectedFilterValue);
    });

    it('#drawImageOnCanvas should correctly set canvas size ', () => {
        const imageWidth = 200;
        const imageHeight = 200;
        const image = new Image(imageWidth, imageHeight);
        service['drawImageOnCanvas'](image, service.canvas);
        expect(service.canvas.width).toBe(imageWidth);
        expect(service.canvas.height).toBe(imageHeight);
    });

    it('should be able to download drawing as image', () => {
        spyOn(document, 'createElement').and.returnValue(spyLink);
        // const filter = ImageFilter.Blur as string;
        // const expectedFilterValue = 'blur(5px)' as string;
        // service['applyFilterOnCanvas'](filter, service.canvas);
        // const context = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        // expect(context.filter).toEqual(expectedFilterValue);
        const drawImageSpy = spyOn<any>(service, 'drawImageOnCanvas').and.callThrough();
        const fileName = 'drawing_1';
        const imageFormat = ImageFormat.PNG;
        service['downloadDrawingAsImage'](fileName, imageFormat);
        const expectedImageSource = service.canvas.toDataURL('image/png') as string;
        expect(spyLink.click).toHaveBeenCalled();
        expect(spyLink.click).toHaveBeenCalledTimes(1);
        // expect(spyLink.click()).toHaveBeenCalledWith(fileName, ImageFormat.PNG);
        expect(spyLink.download).toBe(fileName);
        expect(spyLink.href).toBe(expectedImageSource);
        expect(drawImageSpy).toHaveBeenCalled();
    });
});
