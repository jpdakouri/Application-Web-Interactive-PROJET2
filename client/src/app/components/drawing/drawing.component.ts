import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Coordinate } from '@app/services/mouse-handler/coordinate';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { CanvasResizerService, Status } from '@app/services/tools/canvas-resizer/canvas-resizer.service';
import { PencilService } from '@app/services/tools/pencil-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 800;

export const MINIMUM_WIDTH = 250;
export const MINIMUM_HEIGHT = 250;

export const LOWER_BOUND_WIDTH = 500;
export const LOWER_BOUND_HEIGHT = 500;

export const DEFAULT_WHITE = '#fff';

// export const SIDEBAR_WIDTH = 294;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // aperçu redimensionnement
    resizePreviewHeight: number;
    resizePreviewWidth: number;

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    // private canvasResizer: CanvasResizerService;
    constructor(
        private drawingService: DrawingService,
        private mouseService: MouseHandlerService,
        pencilService: PencilService,
        public canvasResizerService: CanvasResizerService,
    ) {
        this.tools = [pencilService, canvasResizerService];
        this.currentTool = this.tools[0];
        // this.setCanvasSize();
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

        this.drawingService.restoreCanvas();
        // if (this.drawingService.isCanvasBlank()) {
        //     if (confirm("le canvas n'est pas vide! Voulez-vous garder vos modifications?"))
        //         // this.drawingService.clearCanvas(this.drawingService.baseCtx);
        //         this.baseCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        // }

        // this.resizePreviewWidth = this.canvasSize.x;
        // this.resizePreviewHeight = this.canvasSize.y;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        if (!this.canvasResizerService.isResizing()) {
            this.currentTool = this.tools[0];
        }
        // console.log(this.drawingService.isCanvasBlank());

        // redimensionnement
        // if (this.canvasResizerService.isResizing()) this.canvasResizerService.resizePreviewCanvas();
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
        this.drawingService.saveCanvas(this.drawingService.canvas.width, this.drawingService.canvas.height);
    }

    @HostListener('window:mouseleave', ['$event'])
    oneMouseLeave(event: MouseEvent): void {
        // this.drawingService.saveCanvas(this.width, this.height);
        this.currentTool.onMouseLeave(event);
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

    resizeCanvas(): void {
        const deltaX = this.mouseService.calculateDeltaX();
        const deltaY = this.mouseService.calculateDeltaY();

        switch (this.canvasResizerService.status) {
            case Status.MIDDLE_RIGHT_RESIZE:
                this.canvasSize.x += deltaX;
                break;

            case Status.MIDDLE_BOTTOM_RESIZE:
                this.canvasSize.y += deltaY;
                break;

            case Status.BOTTOM_RIGHT_RESIZE:
                this.canvasSize.x += deltaX;
                this.canvasSize.y += deltaY;
                break;
        }
        if (this.canvasSize.x < MINIMUM_WIDTH || this.canvasSize.y < MINIMUM_HEIGHT) {
            this.canvasSize = { x: MINIMUM_WIDTH, y: MINIMUM_HEIGHT };
        }
        this.drawingService.restoreCanvas();
    }

    setCanvasSize(): void {
        this.canvasSize = { x: this.drawingService.calculateWorkingZoneSize().x / 2, y: this.drawingService.calculateWorkingZoneSize().y / 2 };

        if (
            this.drawingService.calculateWorkingZoneSize().x < LOWER_BOUND_WIDTH ||
            this.drawingService.calculateWorkingZoneSize().y < LOWER_BOUND_HEIGHT
        ) {
            this.canvasSize = { x: MINIMUM_WIDTH, y: MINIMUM_HEIGHT };
        }
        console.log('size changed!');
    }

    onMiddleRightResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas(this.width, this.height);
        this.canvasResizerService.onMiddleRightResizerClick();
    }

    onBottomRightResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas(this.width, this.height);
        this.canvasResizerService.onBottomRightResizerClick();
    }

    onMiddleBottomResizerClick(): void {
        this.currentTool = this.tools[1];
        this.drawingService.saveCanvas(this.width, this.height);
        this.canvasResizerService.onMiddleBottomResizerClick();
    }
}
