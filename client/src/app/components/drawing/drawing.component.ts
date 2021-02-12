import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { CanvasResizerService, Status } from '@app/services/tools/canvas-resizer/canvas-resizer.service';
import { PencilService } from '@app/services/tools/pencil-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const DEFAULT_WHITE = '#fff';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour le rectangle de prévisualisation
    @ViewChild('canvasResizerPreview', { static: false }) canvasResizerPreview: ElementRef<HTMLDivElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;

    constructor(private drawingService: DrawingService, pencilService: PencilService, public canvasResizerService: CanvasResizerService) {
        this.tools = [pencilService, canvasResizerService];
        this.currentTool = this.tools[0];
    }

    ngOnInit(): void {
        this.setCanvasSize();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
        this.canvasResizerService.canvasPreviewWidth = this.canvasSize.x;
        this.canvasResizerService.canvasPreviewHeight = this.canvasSize.y;
        this.drawingService.restoreCanvas();
    }

    setCanvasSize(): void {
        this.canvasSize = this.canvasResizerService.calculateCanvasSize();
    }

    resizeCanvas(): void {
        this.canvasSize = this.canvasResizerService.calculateNewCanvasSize(this.canvasSize);
        this.drawingService.restoreCanvas();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    getPreviewCanvasSize(): Coordinate {
        return { x: this.canvasResizerService.canvasPreviewWidth, y: this.canvasResizerService.canvasPreviewHeight };
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        if (!this.canvasResizerService.isResizing()) this.currentTool = this.tools[0];
    }

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);

        if (this.canvasResizerService.isResizing()) this.resizeCanvas();
        this.canvasResizerService.setStatus(Status.OFF);
        this.drawingService.saveCanvas();
    }

    @HostListener('window:mouseover', ['$event'])
    onMouseOver(): void {
        this.currentTool = this.tools[1];
    }

    onMiddleRightResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas();
        this.canvasResizerService.onMiddleRightResizerClick();
    }

    onBottomRightResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas();
        this.canvasResizerService.onBottomRightResizerClick();
    }

    onMiddleBottomResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas();
        this.canvasResizerService.onMiddleBottomResizerClick();
    }
}
