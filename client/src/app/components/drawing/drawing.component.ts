import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // mouse
    // mouseCoordinate: Vec2;
    status: Status = Status.OFF;

    startCoordinate: Vec2;
    endCoordinate: Vec2;
    currentCoordinate: Vec2;

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    constructor(private drawingService: DrawingService, pencilService: PencilService) {
        this.tools = [pencilService];
        this.currentTool = this.tools[0];
        this.setCanvasSize();
        this.startCoordinate = { x: 0, y: 0 };
        this.endCoordinate = { x: 0, y: 0 };
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        // console.log('mouse x = ' + event.x + ' | mouse y = ' + event.y);

        // if (this.status !== Status.OFF) this.resizeCanvas();
        // this.setMouseCoordinate(event.clientX, event.clientY);
        this.currentCoordinate = { x: event.x, y: event.y };
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
        this.startCoordinate = { x: event.x, y: event.y };
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
        this.endCoordinate = { x: event.clientX, y: event.clientY };
        // if (this.status !== Status.OFF) this.resizeCanvas();
        // this.updateStatus(event);
        this.status = Status.OFF;
        this.resizeCanvas();

        this.drawingService.baseCtx.restore();
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
        const deltaX = this.endCoordinate.x - this.startCoordinate.x;
        // const deltaY = this.endCoordinate.y - this.startCoordinate.y;
        this.canvasSize.x += deltaX;
        // this.canvasSize.y += deltaY;
        console.log('resize method called' + this.currentCoordinate);
        // this.status = Status.OFF;
    }

    // updateStatus(event: MouseEvent): void {
    //     // if (this.status !== Status.OFF) event.stopPropagation();
    //     this.status = Status.OFF;
    // }

    onMiddleRightResizerClick(): void {
        console.log('midd right resizer clicked!' + this.currentCoordinate);
        this.drawingService.baseCtx.save();
        this.status = Status.MIDDLE_RIGHT_RESIZE;
        // this.setMouseCoordinate(event.clientX, event.clientY);
    }

    onBottomRightResizerClick(): void {
        console.log('right resizer clicked!' + this.currentCoordinate);

        this.status = Status.BOTTOM_RIGHT_RESIZE;
        // this.setMouseCoordinate(event.clientX, event.clientY);
    }

    onMiddleBottomResizerClick(): void {
        console.log('bott right resizer clicked!' + this.currentCoordinate);

        this.status = Status.MIDDLE_BOTTOM_RESIZE;
        // this.setMouseCoordinate(event.clientX, event.clientY);
    }

    setMouseCoordinate(x: number, y: number): void {
        // this.mouseCoordinate = { x, y };
        this.currentCoordinate.x = x;
        this.currentCoordinate.y = y;
    }

    // isCanvasBlank(): boolean {
    //     // return this.currentDrawing;
    //     return false;
    // }
    //
    // saveDrawing(): void {
    //     // @ts-ignore
    //     this.currentDrawing = this.baseCtx.save();
    // }
    //
    // restoreDrawing(): void {
    //     this.baseCtx.restore();
    // }
}
