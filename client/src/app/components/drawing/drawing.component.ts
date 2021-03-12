import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WHITE, DEFAULT_WIDTH, SIDEBAR_WIDTH, WORKING_ZONE_VISIBLE_PORTION } from '@app/components/components-constants';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { MIN_ERASER_THICKNESS } from '@app/services/tools/tools-constants';
import { Status } from '@app/utils/enums/canvas-resizer-status';
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
    @ViewChild('canvasResizerPreview', { static: false }) canvasResizerPreview: ElementRef<HTMLDivElement>;
    @Output() editorMinWidthEmitter: EventEmitter<number> = new EventEmitter<number>();

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

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
    private cursorHeight: number;
    eraserActive: boolean = false;
    currentTool: Tool;
    toolManagerService: ToolManagerService;
    canvasResizerService: CanvasResizerService;
    toolsNames: typeof ToolsNames = ToolsNames;

    constructor(private drawingService: DrawingService, toolManagerService: ToolManagerService, canvasResizerService: CanvasResizerService) {
        this.toolManagerService = toolManagerService;
        this.canvasResizerService = canvasResizerService;
    }

    ngOnInit(): void {
        this.updateCurrentTool();
        this.setCanvasSize();
        this.subscribeToToolChange();
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

    getPreviewCanvasSize(): Vec2 {
        return { x: this.canvasResizerService.canvasPreviewWidth, y: this.canvasResizerService.canvasPreviewHeight };
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

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.canvasResizerService.isResizing()) {
            this.canvasResizerService.onMouseUp(event);
            this.resizeCanvas();
            this.canvasResizerService.setStatus(Status.OFF);
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

    @HostListener('dblclick', ['$event'])
    onDblClick(): void {
        this.currentTool.onDblClick();
        this.drawingService.saveCanvas();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
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
}
