import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS, PIXEL_DISTANCE, SHIFT_ANGLE_45, SHIFT_ANGLE_HALF_45 } from '@app/services/tools/tools-constants';
import { KeyboardButtons } from '@app/utils/enums/keyboard-button-pressed';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';

@Injectable({
    providedIn: 'root',
})
export abstract class LineCreatorService extends Tool {
    started: boolean;
    pathData: Vec2[];
    shiftPressed: boolean;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
    }

    abstract onMouseUp(event: MouseEvent): void;

    defaultMouseUp(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (!this.shiftPressed) this.pathData.push(this.mouseDownCoord);
        else this.pathData.push(this.desiredAngle(this.mouseDownCoord));

        this.drawLine(
            this.drawingService.previewCtx,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            false,
        );
        this.started = true;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.started) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.verifyValideLine(this.mouseDownCoord);
            this.previewUpdate();
        }
    }
    verifyValideLine(courrentPosition: Vec2): boolean {
        return true;
    }

    onMouseLeave(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.started) {
            this.drawLine(
                this.drawingService.previewCtx,
                this.getPrimaryColor(),
                this.currentColorService.getSecondaryColorHex(),
                this.showDots || false,
                this.dotRadius || DEFAULT_DOT_RADIUS,
                this.pathData,
                this.lineThickness || DEFAULT_MIN_THICKNESS,
                false,
            );
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.started)
            switch (event.key) {
                case KeyboardButtons.Shift:
                    this.shiftPressed = true;
                    this.previewUpdate();
                    break;
                case KeyboardButtons.Escape:
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.clearPath();
                    this.started = false;
                    break;
                case KeyboardButtons.Backspace:
                    if (this.pathData.length > 1) {
                        this.pathData.pop();
                    }
                    this.previewUpdate();
                    event.preventDefault();
                    break;
                default:
                    break;
            }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.shiftPressed && event.key === KeyboardButtons.Shift) {
            this.shiftPressed = false;
            this.previewUpdate();
        }
    }

    abstract getPrimaryColor(): string;

    private previewUpdate(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(
            this.drawingService.previewCtx,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            false,
        );
        if (this.shiftPressed)
            this.drawPreviewLine(this.drawingService.previewCtx, this.desiredAngle(this.mouseDownCoord), this.pathData[this.pathData.length - 1]);
        else this.drawPreviewLine(this.drawingService.previewCtx, this.mouseDownCoord, this.pathData[this.pathData.length - 1]);
    }

    private desiredAngle(mousePosition: Vec2): Vec2 {
        let angle = 0;
        const lastDot = this.pathData[this.pathData.length - 1];

        const distX = mousePosition.x - lastDot.x;
        const distY = mousePosition.y - lastDot.y;
        // transform rad in degrees
        angle = Math.atan(distY / distX);
        // 45 (135, 225, 315) case
        if (this.isBetweenAxes(angle)) {
            if ((distX <= 0 && distY >= 0) || (distX > 0 && distY < 0)) {
                // second or fourth quadrant
                // Math.tan requires rad
                return { x: mousePosition.x, y: lastDot.y - distX * Math.round(Math.tan(SHIFT_ANGLE_45)) };
            } else {
                // first and third quadrant
                return { x: mousePosition.x, y: lastDot.y + distX * Math.round(Math.tan(SHIFT_ANGLE_45)) };
            }
        }
        // 90 (270) case
        if (this.isNearYAxis(angle)) {
            return { x: lastDot.x, y: mousePosition.y };
        }
        // 0 (180) case
        return { x: mousePosition.x, y: lastDot.y };
    }

    private isBetweenAxes(angle: number): boolean {
        return (
            (angle >= SHIFT_ANGLE_HALF_45 && angle <= SHIFT_ANGLE_45 + SHIFT_ANGLE_HALF_45) ||
            (-angle >= SHIFT_ANGLE_HALF_45 && -angle <= SHIFT_ANGLE_45 + SHIFT_ANGLE_HALF_45)
        );
    }

    private isNearYAxis(angle: number): boolean {
        return angle > SHIFT_ANGLE_45 + SHIFT_ANGLE_HALF_45 || -angle > SHIFT_ANGLE_45 + SHIFT_ANGLE_HALF_45;
    }

    clearPath(): void {
        this.pathData = [];
    }

    private drawPreviewLine(ctx: CanvasRenderingContext2D, previewPoint: Vec2, lastPoint: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(previewPoint.x, previewPoint.y);
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.getPrimaryColor();
        ctx.stroke();
    }

    drawLine(
        ctx: CanvasRenderingContext2D,
        primaryColor: string,
        secondaryColor: string,
        dotShown: boolean,
        dotRadius: number,
        path: Vec2[],
        strokeThickness: number,
        closedSegment: boolean,
    ): void {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = primaryColor;
        }
        if (closedSegment) ctx.lineTo(path[0].x, path[0].y);
        ctx.lineWidth = strokeThickness;
        ctx.stroke();

        if (dotShown)
            for (const dot of path) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI, true);
                ctx.fillStyle = secondaryColor;
                ctx.fill();
            }
    }

    verifyLastPoint(dotToVerify: Vec2): boolean {
        const lastDot = this.pathData[this.pathData.length - 1];
        return Math.abs(lastDot.x - dotToVerify.x) <= PIXEL_DISTANCE && Math.abs(lastDot.y - dotToVerify.y) <= PIXEL_DISTANCE;
    }
}
