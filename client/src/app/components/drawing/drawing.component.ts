import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Coordinate } from '@app/classes/coordinate';
import { Tool } from '@app/classes/tool';
import { CanvasResizerService, Status } from '@app/services/drawing/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';

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
    // private tools: Tool[];
    currentTool: Tool;
    toolManagerService: ToolManagerService;
    canvasResizerService: CanvasResizerService;

    isMoverResizer: boolean;

    constructor(private drawingService: DrawingService, toolManagerService: ToolManagerService, canvasResizerService: CanvasResizerService) {
        this.toolManagerService = toolManagerService;
        this.canvasResizerService = canvasResizerService;
    }

    ngOnInit(): void {
        this.updateCurrentTool();
        this.setCanvasSize();
        this.subscribeToToolChange();

        // if (sessionStorage.getItem('canvasBuffer')) {
        //     console.log('rentr/ dans le premier if');
        //     if (confirm("le canvas n'est pas vide! Voulez vous garder vos modifications?")) {
        //         // sessionStorage.setItem('canvasBuffer', this.drawingService.canvas.toDataURL());
        //         this.drawingService.restoreCanvas();
        //         // sessionStorage.clear();
        //     }
        // }
        // sessionStorage.clear();
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

    subscribeToToolChange(): void {
        this.toolManagerService.toolChangeEmitter.subscribe((toolName: ToolsNames) => {
            this.updateCurrentTool();
        });
    }

    setCanvasSize(): void {
        this.canvasSize = this.canvasResizerService.calculateCanvasSize();
        this.emitEditorMinWidth();
    }

    resizeCanvas(): void {
        this.canvasSize = this.canvasResizerService.calculateNewCanvasSize(this.canvasSize);
        this.drawingService.restoreCanvas();
        this.emitEditorMinWidth();
    }

    updateCurrentTool(): void {
        this.currentTool = this.toolManagerService.getCurrentToolInstance();
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
        if (this.canvasResizerService.isResizing()) {
            this.canvasResizerService.onMouseMove(event);
        } else {
            this.currentTool.onMouseMove(event);
        }
    }

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.canvasResizerService.onMouseDown(event);
        } else {
            this.currentTool.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.drawingService.saveCanvas();
            this.canvasResizerService.onMouseUp(event);
            this.resizeCanvas();
            this.canvasResizerService.setStatus(Status.OFF);
            console.log('onMuseUp de resizer !!!!');
        } else {
            this.currentTool.onMouseUp(event);
        }
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

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMiddleRightResizerClick(): void {
        this.drawingService.saveCanvas();
        this.canvasResizerService.onMiddleRightResizerClick();
    }

    onBottomRightResizerClick(): void {
        this.drawingService.saveCanvas();
        this.canvasResizerService.onBottomRightResizerClick();
    }

    onMiddleBottomResizerClick(): void {
        this.drawingService.saveCanvas();
        this.canvasResizerService.onMiddleBottomResizerClick();
    }

    emitEditorMinWidth(): void {
        const editorMinWidth = this.computeEditorMinWidth();
        this.editorMinWidthEmitter.emit(editorMinWidth);
    }

    computeEditorMinWidth(): number {
        return this.width + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
    }
}
