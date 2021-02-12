import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';
import { MouseButton } from '@app/tests-mocks/mock-boutton-pressed';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    private width: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = this.lineThickness || DEFAULT_MIN_THICKNESS;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData);
        }
        this.clearPath();
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.pathData.push(this.getPositionFromMouse(event));
            this.erase(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
            this.drawingService.previewCtx.beginPath();
        }
    }

    private erase(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.width = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = this.width;
        ctx.lineCap = 'square';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
