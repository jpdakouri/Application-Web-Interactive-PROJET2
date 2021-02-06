import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasResizerService } from '@app/services/tools/canvas-resizer/canvas-resizer.service';
import { PencilService } from '@app/services/tools/pencil-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const MINIMUM_WIDTH = 250;
export const MINIMUM_HEIGHT = 250;

export const LOWER_BOUND_WIDTH = 500;
export const LOWER_BOUND_HEIGHT = 500;

export const DEFAULT_WHITE = '#fff';

export const SIDEBAR_WIDTH = 294;

const enum Status {
    OFF = 0,
    MIDDLE_BOTTOM_RESIZE = 1,
    BOTTOM_RIGHT_RESIZE = 2,
    MIDDLE_RIGHT_RESIZE = 3,
}

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    // Pour l'aperçu lors du redimensionnement
    // @ViewChild('resizingPreviewCanvas', { static: false }) resizingPreviewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    // private resizingPreviewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // mouse
    // mouseCoordinate: Vec2;
    status: Status = Status.OFF;

    startCoordinate: Vec2;
    endCoordinate: Vec2;
    currentCoordinate: Vec2;
    // @Input() isResizing: boolean = false;

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    constructor(private drawingService: DrawingService, pencilService: PencilService, canvasResizerService: CanvasResizerService) {
        this.tools = [pencilService, canvasResizerService];
        this.currentTool = this.tools[0];
        this.setCanvasSize();
        this.startCoordinate = { x: 0, y: 0 };
        this.endCoordinate = { x: 0, y: 0 };
    }

    ngOnInit(): void {
        // this.setCanvasSize();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        // this.drawingService.resizingPreviewCtx = this.resizingPreviewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
        this.drawingService.restoreCanvas();
        // if (this.drawingService.isCanvasBlank()) {
        //     confirm("le canavs n'est pas vide");
        // }
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        // console.log('mouse x = ' + event.x + ' | mouse y = ' + event.y);

        // if (this.status !== Status.OFF) this.resizeCanvas();
        // this.setMouseCoordinate(event.clientX, event.clientY);
        // if (this.status !== Status.OFF) event.stopImmediatePropagation();
        this.currentCoordinate = { x: event.x, y: event.y };
    }

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
        this.startCoordinate = { x: event.x, y: event.y };
        if (this.status !== Status.OFF) {
            this.currentTool = this.tools[1];
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
        this.endCoordinate = { x: event.clientX, y: event.clientY };
        if (this.status !== Status.OFF) this.resizeCanvas();
        // this.isResizing = false;
        this.status = Status.OFF;
        this.currentTool = this.tools[0];
        this.drawingService.saveCanvas(this.width, this.height);
    }

    @HostListener('window:mouseleave', ['$event'])
    oneMouseLeave(event: MouseEvent): void {
        this.endCoordinate = { x: event.clientX, y: event.clientY };
        // this.drawingService.saveCanvas(this.width, this.height);
        // this.isResizing = false;
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(): void {
        this.drawingService.saveCanvas(this.width, this.height);
    }

    onMouseOver(): void {
        this.currentTool = this.tools[1];
        // this.isResizing = true;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    setCanvasSize(): void {
        this.canvasSize.x = this.workingZoneSize().x / 2;
        this.canvasSize.y = this.workingZoneSize().y / 2;
        if (this.workingZoneSize().x < LOWER_BOUND_WIDTH || this.workingZoneSize().y < LOWER_BOUND_HEIGHT) {
            this.canvasSize.x = MINIMUM_WIDTH;
            this.canvasSize.y = MINIMUM_HEIGHT;
        }
    }

    workingZoneSize(): Vec2 {
        return {
            x: window.innerWidth - SIDEBAR_WIDTH,
            y: window.innerHeight,
        };
    }

    resizeCanvas(): void {
        // this.isResizing = true;
        const deltaX = this.endCoordinate.x - this.startCoordinate.x;
        const deltaY = this.endCoordinate.y - this.startCoordinate.y;
        // tslint:disable-next-line:prefer-switch
        if (this.status === Status.MIDDLE_RIGHT_RESIZE) this.canvasSize.x += deltaX;
        else if (this.status === Status.MIDDLE_BOTTOM_RESIZE) this.canvasSize.y += deltaY;
        else if (this.status === Status.BOTTOM_RIGHT_RESIZE) {
            this.canvasSize.x += deltaX;
            this.canvasSize.y += deltaY;
        }

        // this.canvasSize.y += deltaY;
        console.log('resize method called' + this.currentCoordinate);
        // this.status = Status.OFF;
        this.drawingService.restoreCanvas();
    }

    onMiddleRightResizerClick(): void {
        // this.isResizing = true;
        // console.log('midd right resizer clicked!');
        console.log('midd right resizer dragged!');
        this.drawingService.saveCanvas(this.width, this.height);

        this.currentTool = this.tools[1];
        this.status = Status.MIDDLE_RIGHT_RESIZE;
    }

    onBottomRightResizerClick(): void {
        console.log('right resizer clicked!');
        this.drawingService.saveCanvas(this.width, this.height);

        this.currentTool = this.tools[1];
        this.status = Status.BOTTOM_RIGHT_RESIZE;
    }

    onMiddleBottomResizerClick(): void {
        console.log('bott right resizer clicked!');
        this.drawingService.saveCanvas(this.width, this.height);

        this.currentTool = this.tools[1];
        this.status = Status.MIDDLE_BOTTOM_RESIZE;
    }

    setMouseCoordinate(x: number, y: number): void {
        this.currentCoordinate = { x, y };
    }

    isResizing(): boolean {
        return this.status !== Status.OFF;
    }
}
