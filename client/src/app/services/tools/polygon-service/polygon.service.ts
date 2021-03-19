import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse.service';
import { DEFAULT_MIN_THICKNESS, DEFAULT_NUMBER_OF_SIDE, LINE_DASH } from '@app/services/tools/tools-constants';
// import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Sign } from '@app/utils/enums/rgb-settings';
import { ShapeStyle } from '@app/utils/enums/shape-style';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    firstGrid: Vec2;
    numberOfSides: number;
    currentColourService: CurrentColourService;
    visualisationEllipse: EllipseService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService, visualisationEllipse: EllipseService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
        this.visualisationEllipse = visualisationEllipse;
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygon(this.drawingService.previewCtx, this.mouseDownCoord);
            this.drawPreview(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygon(this.drawingService.baseCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    private drawOutLine(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.drawCircle(finalGrid);
        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;
        const center: Vec2 = { x: startCoord.x + width / 2, y: startCoord.y + height / 2 };
        const radius = Math.abs(height / 2);
        const angle = (2 * Math.PI) / this.numberOfSides;
        ctx.setLineDash([]);
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.currentColourService.getSecondaryColorHex();
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - radius);
        for (let i = 1; i < this.numberOfSides; i++) {
            ctx.lineTo(center.x + radius * Math.sin(i * angle), center.y - radius * Math.cos(i * angle));
        }
        ctx.closePath();
        ctx.stroke();
    }

    private drawFilled(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.drawCircle(finalGrid);
        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;
        const center: Vec2 = { x: startCoord.x + width / 2, y: startCoord.y + height / 2 };
        const radius = Math.abs(height / 2);
        const angle = (2 * Math.PI) / this.numberOfSides;
        ctx.setLineDash([]);
        ctx.lineWidth = DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.currentColourService.getPrimaryColorHex();
        ctx.fillStyle = this.currentColourService.getPrimaryColorHex();
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - radius);
        for (let i = 1; i < this.numberOfSides; i++) {
            ctx.lineTo(center.x + radius * Math.sin(i * angle), center.y - radius * Math.cos(i * angle));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    private drawFilledOutLine(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.drawCircle(finalGrid);
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        const startCoord = { ...this.firstGrid };
        const width = finalGrid.x;
        const height = finalGrid.y;
        const center: Vec2 = { x: startCoord.x + width / 2, y: startCoord.y + height / 2 };
        const radius = Math.abs(height / 2);
        const angle = (2 * Math.PI) / this.numberOfSides;
        ctx.setLineDash([]);
        ctx.strokeStyle = this.currentColourService.getSecondaryColorHex();
        ctx.fillStyle = this.currentColourService.getPrimaryColorHex();
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - radius);
        for (let i = 1; i < this.numberOfSides; i++) {
            ctx.lineTo(center.x + radius * Math.sin(i * angle), center.y - radius * Math.cos(i * angle));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    private drawPolygon(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        switch (this.shapeStyle) {
            case ShapeStyle.Outline:
                this.drawOutLine(ctx, finalGrid);
                break;

            case ShapeStyle.Filled:
                this.drawFilled(ctx, finalGrid);
                break;

            case ShapeStyle.FilledOutline:
                this.drawFilledOutLine(ctx, finalGrid);
                break;

            default:
                this.drawOutLine(ctx, finalGrid);
                break;
        }
        this.numberOfSides = this.numberOfSides || DEFAULT_NUMBER_OF_SIDE;
    }

    private drawPreview(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.setLineDash([LINE_DASH, LINE_DASH]);
        this.drawCircle(finalGrid);
        let firstGrid: Vec2 = this.firstGrid;
        if (this.isMouseInFirstQuadrant()) {
            finalGrid.x += ctx.lineWidth;
            finalGrid.y += ctx.lineWidth;
            firstGrid = { x: this.firstGrid.x - ctx.lineWidth / 2, y: this.firstGrid.y - ctx.lineWidth / 2 };
        }

        if (this.isMouseInSecondQuadrant()) {
            finalGrid.x -= ctx.lineWidth;
            finalGrid.y -= ctx.lineWidth;
            firstGrid = { x: this.firstGrid.x + ctx.lineWidth / 2, y: this.firstGrid.y + ctx.lineWidth / 2 };
        }

        if (this.isMouseInThirdQuadrant()) {
            finalGrid.x -= ctx.lineWidth;
            finalGrid.y += ctx.lineWidth;
            firstGrid = { x: this.firstGrid.x + ctx.lineWidth / 2, y: this.firstGrid.y - ctx.lineWidth / 2 };
        }

        if (this.isMouseInFourthQuadrant()) {
            finalGrid.x += ctx.lineWidth;
            finalGrid.y -= ctx.lineWidth;
            firstGrid = { x: this.firstGrid.x - ctx.lineWidth / 2, y: this.firstGrid.y + ctx.lineWidth / 2 };
        }
        this.visualisationEllipse.drawOutline(this.drawingService.previewCtx, firstGrid, finalGrid, 'blue', 1);
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
