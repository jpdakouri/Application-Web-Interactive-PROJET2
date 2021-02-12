import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '@app/classes/coordinate';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { CanvasResizerService, Status } from '@app/services/tools/canvas-resizer/canvas-resizer.service';
import { PencilService } from '@app/services/tools/pencil-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const DEFAULT_WHITE = '#fff';

export const SIDEBAR_WIDTH = 425;

const WORKING_ZONE_VISIBLE_PORTION = 100;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour le rectangle de prévisualisation
    @ViewChild('canvasResizerPreview', { static: false }) canvasResizerPreview: ElementRef<HTMLDivElement>;
    @Output() editorMinWidthEmitter: EventEmitter<number> = new EventEmitter<number>();

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    toolManagerService: ToolManagerService;

    constructor(private drawingService: DrawingService, toolManagerService: ToolManagerService, public canvasResizerService: CanvasResizerService) {
        this.toolManagerService = toolManagerService;
       this.tools = [pencilService, canvasResizerService];
       this.currentTool = this.tools[0];
    }

    ngOnInit(): void {
        this.updateCurrentTool();
        this.setCanvasSize();
        this.subscribeToToolChange();
    }

    subscribeToToolChange(): void {
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

   updateCurrentTool(): void {
      this.currentTool = this.toolManagerService.getCurrentToolInstance();
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

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(): void {
        this.drawingService.saveCanvas();
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('dblclick', ['$event'])
    onDblClick(): void {
        this.currentTool.onDblClick();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    @HostListener('window:mouseover', ['$event'])
    onMouseOver(): void {
        this.currentTool = this.tools[1];
    }

    // setCanvasSize(): void {
    //   this.canvasSize.x = this.workingZoneSize().x / 2;
    //   this.canvasSize.y = this.workingZoneSize().y / 2;
    //   if (this.workingZoneSize().x < LOWER_BOUND_WIDTH || this.workingZoneSize().y < LOWER_BOUND_HEIGHT) {
    //     this.canvasSize.x = MINIMUM_WIDTH;
    //     this.canvasSize.y = MINIMUM_HEIGHT;
    //   }
    //   this.emitEditorMinWidth();
    // }


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

    saveDrawing(): void {
      this.baseCtx.save();
    }

    restoreDrawing(): void {
        this.baseCtx.restore();
    }

    emitEditorMinWidth(): void {
        const editorMinWidth = this.computeEditorMinWidth();
        this.editorMinWidthEmitter.emit(editorMinWidth);
    }
    computeEditorMinWidth(): number {
        return this.width + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
    }
}
