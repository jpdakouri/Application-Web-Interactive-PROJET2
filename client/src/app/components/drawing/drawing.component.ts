import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WHITE, DEFAULT_WIDTH, SIDEBAR_WIDTH, WORKING_ZONE_VISIBLE_PORTION } from '@app/components/components-constants';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { SelectionEllipseService } from '@app/services/tools/selection-ellipse-service/selection-ellipse.service';
import { SelectionPolygonalLassoService } from '@app/services/tools/selection-polygonal-lasso/selection-polygonal-lasso.service';
import { SelectionRectangleService } from '@app/services/tools/selection-rectangle-service/selection-rectangle.service';
import { SelectionResizerService } from '@app/services/tools/selection-resizer-service/selection-resizer.service';
import { SelectionService } from '@app/services/tools/selection-service/selection.service';
import { TextService } from '@app/services/tools/text/text.service';
import { MIN_ERASER_THICKNESS } from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { Status } from '@app/utils/enums/canvas-resizer-status';
import { SelectionStatus } from '@app/utils/enums/selection-resizer-status';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { EraserCursor } from '@app/utils/interfaces/eraser-cursor';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasResizerPreview', { static: false }) canvasResizerPreview: ElementRef<HTMLDivElement>;
    @ViewChild('selectedArea', { static: false }) selectedArea: ElementRef<HTMLCanvasElement>;
    @ViewChild('textArea', { static: false }) textArea: ElementRef<HTMLTextAreaElement>;
    @Output() editorMinWidthEmitter: EventEmitter<number> = new EventEmitter<number>();

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private selectedAreaCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private cursorHeight: number;
    eraserActive: boolean = false;
    currentTool: Tool;
    toolManagerService: ToolManagerService;
    canvasResizerService: CanvasResizerService;
    selectionResizerService: SelectionResizerService;
    toolsNames: typeof ToolsNames = ToolsNames;
    selectionStatus: typeof SelectionStatus = SelectionStatus;

    eraserCursor: EraserCursor = {
        cursor: 'none',
        position: 'absolute',
        width: '3px',
        height: '3px',
        top: '0px',
        left: '0px',
        border: '2px solid black',
        backgroundColor: 'white',
        transform: 'translate(-50%, -50%)',
        zIndex: '3',
    };
    selectionEllipseService: SelectionEllipseService;
    selectionRectangleService: SelectionRectangleService;
    selectionPolygonalLassoService: SelectionPolygonalLassoService;
    textService: TextService;

    constructor(
        private drawingService: DrawingService,
        private undoRedo: UndoRedoService,
        private saveDrawingService: SaveDrawingService,
        public saveService: SaveDrawingService,
        public gridService: GridService,
        selectionResizerService: SelectionResizerService,
        toolManagerService: ToolManagerService,
        canvasResizerService: CanvasResizerService,
        selectionEllipseService: SelectionEllipseService,
        selectionPolygonalLassoService: SelectionPolygonalLassoService,
        selectionRectangleService: SelectionRectangleService,
        textService: TextService,
    ) {
        this.toolManagerService = toolManagerService;
        this.canvasResizerService = canvasResizerService;
        this.selectionResizerService = selectionResizerService;
        this.selectionEllipseService = selectionEllipseService;
        this.selectionRectangleService = selectionRectangleService;
        this.selectionPolygonalLassoService = selectionPolygonalLassoService;
        this.textService = textService;
    }

    ngOnInit(): void {
        this.updateCurrentTool();
        this.setCanvasSize();
        this.subscribeToToolChange();
        this.subscribeToNewDrawing();
        this.subscribeToCreateNewDrawingEmitter();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.selectedAreaCtx = this.selectedArea.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.selectedAreaCtx = this.selectedAreaCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.saveDrawingService.originalCanvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas = this.saveService.originalCanvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.style.backgroundColor = DEFAULT_WHITE;
        this.canvasResizerService.canvasPreviewWidth = this.canvasSize.x;
        this.canvasResizerService.canvasPreviewHeight = this.canvasSize.y;
        this.drawingService.restoreCanvas();
        this.drawingService.saveCanvas();
        this.undoRedo.saveInitialState();
        setTimeout(() => {
            this.selectionEllipseService.height = this.drawingService.canvas.height;
            this.selectionEllipseService.width = this.drawingService.canvas.width;
            this.selectionPolygonalLassoService.height = this.drawingService.canvas.height;
            this.selectionPolygonalLassoService.width = this.drawingService.canvas.width;
        });
        setTimeout(() => {
            this.undoRedo.saveInitialState();
        });
    }

    subscribeToToolChange(): void {
        this.toolManagerService.toolChangeEmitter.subscribe(() => {
            this.updateCurrentTool();
        });
    }

    subscribeToCreateNewDrawingEmitter(): void {
        this.drawingService.createNewDrawingEmitter.subscribe(() => {
            this.canvasSize = this.canvasResizerService.calculateCanvasSize();
            this.canvasResizerService.updatePreviewCanvasSize(this.canvasSize);
            this.gridService.clear();
        });
    }

    subscribeToNewDrawing(): void {
        this.drawingService.newDrawing.subscribe((result: Vec2) => {
            this.canvasSize = result;
            this.canvasResizerService.updatePreviewCanvasSize(result);
            this.gridService.clear();
        });
    }

    setCanvasSize(): void {
        this.canvasSize = this.canvasResizerService.calculateCanvasSize();
        this.emitEditorMinWidth();
    }

    resizeCanvas(): void {
        this.canvasSize = this.canvasResizerService.calculateNewCanvasSize(this.canvasSize);
        this.drawingService.restoreDrawing();
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

    getPreviewCanvasSize(): Vec2 {
        return { x: this.canvasResizerService.canvasPreviewWidth, y: this.canvasResizerService.canvasPreviewHeight };
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(): void {
        this.drawingService.saveCanvas();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.eraserActive = false;
            this.canvasResizerService.onMouseMove(event);
        } else {
            this.currentTool.onMouseMove(event);
            this.eraserActive = this.currentTool.eraserActive || false;
            this.updateEraserCursor(event);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.canvasResizerService.onMouseDown(event);
        } else {
            this.currentTool.onMouseDown(event);
        }
    }

    @HostListener('dragstart', ['$event'])
    onDrag(event: MouseEvent): void {
        event.preventDefault();
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.canvasResizerService.onMouseUp(event);
            this.resizeCanvas();
            this.canvasResizerService.setStatus(Status.OFF);
            if (this.gridService.showGrid)
                setTimeout(() => {
                    this.gridService.newGrid(null);
                });
        } else {
            this.currentTool.onMouseUp(event);
        }
        this.drawingService.saveCanvas();
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.eraserActive = false;
            this.canvasResizerService.onMouseMove(event);
        } else {
            this.currentTool.onMouseLeave(event);
        }
        this.eraserActive = this.currentTool.eraserActive || false;
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    @HostListener('dblclick', ['$event'])
    onDblClick(): void {
        this.currentTool.onDblClick();
        this.drawingService.saveCanvas();
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheelScroll(event: WheelEvent): void {
        this.currentTool.onMouseWheelScroll(event);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(): boolean {
        if (this.toolManagerService.currentTool === this.toolsNames.Pipette) return false; // disables the standard chrome menu
        return true;
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

    onSelectionBoxClick(status: SelectionStatus): void {
        this.toolManagerService.emitToolChange(this.toolsNames.SelectionResizer);
        this.selectionResizerService.setStatus(status);
    }

    emitEditorMinWidth(): void {
        const editorMinWidth = this.computeEditorMinWidth();
        this.editorMinWidthEmitter.emit(editorMinWidth);
    }

    computeEditorMinWidth(): number {
        return this.width + SIDEBAR_WIDTH + WORKING_ZONE_VISIBLE_PORTION;
    }

    isCurrentTool(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }

    updateEraserCursor(event: MouseEvent): void {
        this.cursorHeight = this.currentTool.lineThickness || MIN_ERASER_THICKNESS;
        this.eraserCursor.height = this.cursorHeight - 2 + 'px';
        this.eraserCursor.width = this.cursorHeight - 2 + 'px';
        const mousePosition = this.currentTool.getPositionFromMouse(event);
        this.eraserCursor.left = mousePosition.x + 'px';
        this.eraserCursor.top = mousePosition.y + 'px';
        this.eraserActive = this.currentTool.eraserActive || false;
    }

    isActiveSelection(): boolean {
        return SelectionService.selectionActive;
    }

    getSelectedAreaSize(): Vec2 {
        return { x: this.drawingService.selectedAreaCtx.canvas.width, y: this.drawingService.selectedAreaCtx.canvas.height };
    }

    getTopLeftCorner(): Vec2 {
        return { x: this.drawingService.selectedAreaCtx.canvas.offsetLeft, y: this.drawingService.selectedAreaCtx.canvas.offsetTop };
    }
}
