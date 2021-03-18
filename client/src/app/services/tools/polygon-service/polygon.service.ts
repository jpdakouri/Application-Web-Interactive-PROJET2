import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
// import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
// import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Sign } from '@app/utils/enums/rgb-settings';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

const DEFAULT_NUMBER_OF_SIDE = 5;
@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    private firstGrid: Vec2;
    // private begin: Vec2;
    // private end: Vec2;
    private numberOfSides: number;
    currentColourService: CurrentColourService;
    visualisationEllipse: EllipseService;
    private test: boolean = true;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService, visualisationEllipse: EllipseService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.visualisationEllipse = visualisationEllipse;
        this.clearPath();
        this.numberOfSides = DEFAULT_NUMBER_OF_SIDE;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
            // this.begin = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            // this.end = this.getPositionFromMouse(event);
            console.log('mouseDown: ', this.mouseDownCoord);
            console.log('firstGrid: ', this.firstGrid);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.drawPolygon(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // this.end = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygon(this.drawingService.baseCtx, this.mouseDownCoord);
            /*if (this.test) {
                this.drawPolygon(this.drawingService.previewCtx, this.mouseDownCoord);
            }*/
            this.clearPath();
        }
        this.mouseDown = false;
    }

    private drawPolygon(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.drawCircle(finalGrid);
        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;
        const center: Vec2 = { x: startCoord.x + width / 2, y: startCoord.y + height / 2 };
        const radius = Math.abs(height / 2);
        const angle = (2 * Math.PI) / this.numberOfSides;
        console.log('radius ', radius);
        console.log('center ', center);
        console.log('first ', this.firstGrid);
        console.log('final ', finalGrid);
        // console.log('angle ', angle);
        ctx.beginPath();
        // ctx.ellipse(center.x, center.y, radius, radius, 0, 0, 2 * Math.PI);
        ctx.moveTo(center.x + radius, center.y);
        for (let i = 1; i <= this.numberOfSides; i++) {
            ctx.lineTo(center.x + radius * Math.cos(i * angle), center.y + radius * Math.sin(i * angle));
        }
        ctx.stroke();
        this.visualisationEllipse.drawOutline(this.drawingService.previewCtx, this.firstGrid, finalGrid, 'blue', 1);
    }

    private isMouseInFirstQuadrant(): boolean {
        //  mouse is in first quadrant (+/+)
        return Math.sign(this.mouseDownCoord.x) === Sign.Positive && Math.sign(this.mouseDownCoord.y) === Sign.Positive;
    }

    private isMouseInSecondQuadrant(): boolean {
        // mouse is in third quadrant (-/-)
        return Math.sign(this.mouseDownCoord.x) === Sign.Negative && Math.sign(this.mouseDownCoord.y) === Sign.Negative;
    }

    private isMouseInThirdQuadrant(): boolean {
        // mouse is in fourth quadrant (-/+)
        return Math.sign(this.mouseDownCoord.x) === Sign.Negative && Math.sign(this.mouseDownCoord.y) === Sign.Positive;
    }

    private isMouseInFourthQuadrant(): boolean {
        // mouse is in second quadrant (+/-)
        return Math.sign(this.mouseDownCoord.x) === Sign.Positive && Math.sign(this.mouseDownCoord.y) === Sign.Negative;
    }

    private isXGreaterThanY(): boolean {
        return Math.abs(this.mouseDownCoord.x) > Math.abs(this.mouseDownCoord.y);
    }

    private isYGreaterThanX(): boolean {
        return Math.abs(this.mouseDownCoord.y) > Math.abs(this.mouseDownCoord.x);
    }

    private drawCircle(grid: Vec2): void {
        if (this.isMouseInFirstQuadrant()) {
            grid.x = grid.y = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

        if (this.isMouseInSecondQuadrant()) {
            grid.x = grid.y = Math.max(this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

        if (this.isMouseInThirdQuadrant()) {
            this.isXGreaterThanY() ? (grid.x = -grid.y) : (grid.y = -grid.x);
        }

        if (this.isMouseInFourthQuadrant()) {
            this.isYGreaterThanX() ? (grid.y = -grid.x) : (grid.x = -grid.y);
        }
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
