import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { MouseButtons } from '@app/utils/enums/list-boutton-pressed';
// import { ShapeStyle } from '@app/utils/enums/shape-style';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleEllipseService extends Tool {
    private firstGrid: Vec2;
    // private shiftDown: boolean;
    private data: ImageData;
    rectangleService: RectangleService;
    currentColourService: CurrentColourService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.firstGrid = this.getPositionFromMouse(event);
            // this.updatePreview();
        }
    }

    onMouseMove(event: MouseEvent): void {
        // this.rectangleService.onMouseMove(event);
        if (this.mouseDown) {
            this.mouseDownCoord.x = this.getPositionFromMouse(event).x - this.firstGrid.x;
            this.mouseDownCoord.y = this.getPositionFromMouse(event).y - this.firstGrid.y;
            this.updatePreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // this.drawRectangle(this.drawingService.previewCtx, this.mouseDownCoord);
            // if (this.shiftDown) {
            //     this.drawSquare(this.mouseDownCoord);
            // }
            this.drawRectangle(this.drawingService.baseCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = this.currentColourService.getSecondaryColorRgba();
        ctx.setLineDash([5, 10]);
        const startCoord = { ...this.firstGrid };
        const width = Math.abs(finalGrid.x);
        const height = Math.abs(finalGrid.y);

        if (finalGrid.x < 0) {
            startCoord.x += finalGrid.x;
        }
        if (finalGrid.y < 0) {
            startCoord.y += finalGrid.y;
        }
        ctx.strokeRect(startCoord.x, startCoord.y, width, height);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.beginPath();
        this.data = ctx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.clearRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        console.log(this.data);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        this.drawPerimeter(this.drawingService.previewCtx, currentCoord);
        // if (this.shiftDown) {
        //     this.drawSquare(currentCoord);
        // }
        this.drawRectangle(this.drawingService.previewCtx, currentCoord);
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
