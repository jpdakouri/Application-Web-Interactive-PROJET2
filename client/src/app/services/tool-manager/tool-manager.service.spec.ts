import { TestBed } from '@angular/core/testing';
import { PencilService } from '@app/services/tools/pencil.service';
import { AerosolService, EllipseService, EraserService, LineService, RectangleService, ToolManagerService } from './tool-manager.service';

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
});
