import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { KeyboardButtons, MouseButtons } from '@app/utils/enums/list-boutton-pressed';
// import { ShapeStyle } from '@app/utils/enums/shape-style';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleEllipseService extends Tool {
    private firstGrid: Vec2;
    private imageData: ImageData;
    // private shiftDown: boolean;
    rectangleService: RectangleService;
    currentColourService: CurrentColourService;
    private currentCoord: Vec2;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.currentColourService = currentColourService;
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.currentCoord = this.firstGrid = this.getPositionFromMouse(event);
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
            this.selectBox(this.drawingService.previewCtx, this.mouseDownCoord);
            this.clearPath();
        }
        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButtons.Up: {
                this.currentCoord.y -= 3;
                break;
            }
            case KeyboardButtons.Down: {
                this.currentCoord.y += 3;
                break;
            }
            case KeyboardButtons.Right: {
                this.currentCoord.x += 3;
                break;
            }
            case KeyboardButtons.Left: {
                this.currentCoord.x -= 3;
                break;
            }
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(this.imageData, this.currentCoord.x, this.currentCoord.y);
    }

    drawRectanglePerimeter(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        ctx.strokeStyle = 'black';
        ctx.setLineDash([5, 15]);

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

    private selectBox(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
        ctx.putImageData(this.imageData, this.firstGrid.x, this.firstGrid.y);
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private selectEllipse(ctx: CanvasRenderingContext2D, finalGrid: Vec2): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.firstGrid.x, this.firstGrid.y, finalGrid.x, finalGrid.y);
    }

    private updatePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const currentCoord = { ...this.mouseDownCoord };
        this.drawingService.previewCtx.beginPath();
        this.drawRectanglePerimeter(this.drawingService.previewCtx, currentCoord);
        // this.selectBox(this.drawingService.previewCtx, currentCoord);
        // if (this.shiftDown) {
        //     this.drawSquare(currentCoord);
        // }
        this.drawingService.previewCtx.closePath();
    }

    private clearPath(): void {
        this.firstGrid = this.mouseDownCoord = { x: 0, y: 0 };
    }
}
