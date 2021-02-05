import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_MIN_THICKNESS, PIXEL_DISTANCE, SHIFT_ANGLE } from '@app/services/tools/tools-constants';
import { KeyboardButton, MouseButton } from '@app/tests-mocks/mock-boutton-pressed';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private started: boolean;
    private pathData: Vec2[];
    private shiftPressed: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);

            if (!this.shiftPressed) this.pathData.push(this.mouseDownCoord);
            else this.pathData.push(this.desiredAngle(this.mouseDownCoord));

            this.drawLine(this.drawingService.previewCtx, this.pathData, false);
            this.started = true;
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.previewUpdate();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.started) this.drawLine(this.drawingService.previewCtx, this.pathData, false);
    }

    onDblClick(event: MouseEvent): void {
        this.started = false;
        let closed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.verifyLastPoint(this.pathData[0])) {
            this.pathData.pop();
            this.pathData.pop();
            closed = true;
        } else if (this.verifyLastPoint(this.pathData[this.pathData.length - 2])) {
            this.pathData.pop();
        }
        this.drawLine(this.drawingService.baseCtx, this.pathData, closed);
        this.clearPath();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey) {
            this.shiftPressed = true;
            this.previewUpdate();
        } else if (event.key === KeyboardButton.Escape) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.started = false;
        } else if (event.key === KeyboardButton.Backspace) {
            if (this.pathData.length > 1) {
                this.pathData.pop();
            }
            this.previewUpdate();
            event.preventDefault();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftPressed && !event.shiftKey) {
            this.shiftPressed = false;
            this.previewUpdate();
        }
    }

    private previewUpdate(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData, false);
        if (this.shiftPressed)
            this.drawPreviewLine(this.drawingService.previewCtx, this.desiredAngle(this.mouseDownCoord), this.pathData[this.pathData.length - 1]);
        else this.drawPreviewLine(this.drawingService.previewCtx, this.mouseDownCoord, this.pathData[this.pathData.length - 1]);
    }

    private desiredAngle(mousePosition: Vec2): Vec2 {
        const lastDot = this.pathData[this.pathData.length - 1];
        let clsDots: Vec2[];
        clsDots = [];

        const distX = mousePosition.x - lastDot.x;
        const distY = mousePosition.y - lastDot.y;

        clsDots.push({ x: lastDot.x, y: mousePosition.y });
        clsDots.push({ x: mousePosition.x, y: lastDot.y });

        if (distX > 0) {
            if (distY < 0) {
                clsDots.push({ x: mousePosition.x, y: lastDot.y - distX * Math.tan(SHIFT_ANGLE) });
            } else {
                clsDots.push({ x: mousePosition.x, y: lastDot.y + distX * Math.tan(SHIFT_ANGLE) });
            }
        } else {
            if (distY < 0) {
                clsDots.push({ x: mousePosition.x, y: lastDot.y + distX * Math.tan(SHIFT_ANGLE) });
            } else {
                clsDots.push({ x: mousePosition.x, y: lastDot.y - distX * Math.tan(SHIFT_ANGLE) });
            }
        }
        return this.closestDot(mousePosition, clsDots);
    }

    private closestDot(original: Vec2, dots: Vec2[]): Vec2 {
        let clsDot = original;
        let smallestDist = Number.MAX_VALUE;
        for (const dot of dots) {
            const distx = original.x - dot.x;
            const distY = original.y - dot.y;
            const distance = Math.sqrt(distx * distx + distY * distY);
            if (distance < smallestDist) {
                clsDot = dot;
                smallestDist = distance;
            }
        }
        return clsDot;
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private drawPreviewLine(ctx: CanvasRenderingContext2D, previewPoint: Vec2, lastPoint: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(previewPoint.x, previewPoint.y);
        ctx.stroke();
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], closed: boolean): void {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        if (closed) ctx.lineTo(path[0].x, path[0].y);
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.stroke();

        if (this.showDots)
            for (const dot of path) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, this.dotRadius ? this.dotRadius : 1, 0, 2 * Math.PI, true);
                ctx.fill();
            }
    }

    private verifyLastPoint(dotToVerify: Vec2): boolean {
        const lastDot = this.pathData[this.pathData.length - 1];
        return (
            lastDot.x + PIXEL_DISTANCE > dotToVerify.x &&
            lastDot.x - PIXEL_DISTANCE < dotToVerify.x &&
            lastDot.y + PIXEL_DISTANCE > dotToVerify.y &&
            lastDot.y - PIXEL_DISTANCE < dotToVerify.y
        );
    }
}