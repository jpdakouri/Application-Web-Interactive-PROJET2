// import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolsNames } from '@app/enums/tools-names';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const MINIMUM_WIDTH = 250;
export const MINIMUM_HEIGHT = 250;

export const LOWER_BOUND_WIDTH = 500;
export const LOWER_BOUND_HEIGHT = 500;

export const DEFAULT_WHITE = '#fff';

export const SIDEBAR_WIDTH = 294;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private cursorHeight: number;

    // tslint:disable-next-line:typedef
    eraserCursor = {
        cursor: 'none',
        position: 'inherit',
        width: '30px',
        height: '30px',
        top: '100px',
        left: '100px',
        border: '2px solid black',
        backgroundColor: 'white',
        transform: 'translate(-50%, -50%)',
        zIndex: '50',
    };
    // private currentDrawing: CanvasRenderingContext2D;
    currentTool: Tool;
    toolManagerService: ToolManagerService;

    constructor(private drawingService: DrawingService, toolManagerService: ToolManagerService) {
        this.toolManagerService = toolManagerService;
    }

    ngOnInit(): void {
        this.currentTool = this.toolManagerService.getCurrentToolInstance();
        this.setCanvasSize();
        this.toolManagerService.toolChangeEmitter.subscribe((toolName: ToolsNames) => {
            this.updateCurrentTool();
        });
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
        this.drawingService.restoreCanvas();
    }

    updateCurrentTool(): void {
        this.currentTool = this.toolManagerService.getCurrentToolInstance();
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        // tslint:disable-next-line:no-magic-numbers
        this.cursorHeight = this.currentTool.lineThickness || 50;

        this.eraserCursor.height = this.cursorHeight + 'px';
        this.eraserCursor.width = this.cursorHeight + 'px';
        const mousePosition = this.currentTool.getPositionFromMouse(event);
        this.eraserCursor.left = mousePosition.x + 'px';
        this.eraserCursor.top = mousePosition.y + 'px';
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(): void {
        this.drawingService.saveCanvas(this.width, this.height);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('dblclick', ['$event'])
    onDblClick(event: MouseEvent): void {
        this.currentTool.onDblClick(event);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
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

    isCanvasBlank(): boolean {
        // return this.currentDrawing;
        return false;
    }

    saveDrawing(): void {
        // this.currentDrawing =
        this.baseCtx.save();
    }

    restoreDrawing(): void {
        this.baseCtx.restore();
    }

    // tslint:disable-next-line:no-empty
    onMiddleRightClick(): void {}
}
