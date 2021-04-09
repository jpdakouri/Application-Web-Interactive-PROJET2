import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCreatorService } from '@app/services/line-creator/line-creator.service';
import { DEFAULT_DOT_RADIUS, DEFAULT_MIN_THICKNESS, MIN_ARRAY_LENGTH } from '@app/services/tools/tools-constants';
import { ToolCommand } from '@app/utils/interfaces/tool-command';
@Injectable({
    providedIn: 'root',
})
export class SelectionPolygonalLassoService extends LineCreatorService {
    private valideEndPoint: boolean = true;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.valideEndPoint && this.mouseDown) {
            this.defaultMouseUp(event);
            if (this.pathData.length > MIN_ARRAY_LENGTH && this.verifyLastPoint(this.pathData[0])) this.endOfSelection();
        }
        this.mouseDown = false;
    }

    getPrimaryColor(): string {
        return this.valideEndPoint && this.pathData.length >= MIN_ARRAY_LENGTH ? '#000000' : '#ff0000';
    }

    verifyValideLine(courrentPosition: Vec2): boolean {
        const pathLength = this.pathData.length - 1;
        const lineToVerify: Vec2[] = [this.pathData[pathLength], courrentPosition];
        for (let i = 0; i < pathLength - 1; i++) {
            const drawnLine: Vec2[] = [this.pathData[i], this.pathData[i + 1]];
            if (this.verifiyCrossedLines(drawnLine, lineToVerify)) {
                this.valideEndPoint = false;
                return false;
            }
        }
        this.valideEndPoint = true;
        return true;
    }

    // verifies if points are counter clock wise
    private ccw(A: Vec2, B: Vec2, C: Vec2): boolean {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }

    // algorithm found at https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
    private verifiyCrossedLines(line1: Vec2[], line2: Vec2[]): boolean {
        return (
            // this.superposedLines(line1, line2) &&
            this.ccw(line1[0], line2[0], line2[1]) !== this.ccw(line1[1], line2[0], line2[1]) &&
            this.ccw(line1[0], line1[1], line2[0]) !== this.ccw(line1[0], line1[1], line2[1])
        );
    }

    private endOfSelection(): void {
        const closedSegment = true;
        this.started = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.pop();
        this.drawLine(
            this.drawingService.baseCtx,
            this.getPrimaryColor(),
            this.currentColorService.getSecondaryColorHex(),
            this.showDots || false,
            this.dotRadius || DEFAULT_DOT_RADIUS,
            this.pathData,
            this.lineThickness || DEFAULT_MIN_THICKNESS,
            closedSegment,
        );
        this.clearPath();
    }

    getClippedSize(coords: Vec2[]): Vec2 {
        const height = Math.abs(coords[1].y - coords[0].y);
        const width = Math.abs(coords[1].x - coords[0].x);
        return { x: width, y: height } as Vec2;
    }

    getClippedCoords(): Vec2[] {
        let maxCoords = { x: 0, y: 0 } as Vec2;
        let minCoords = { x: 1000, y: 1000 } as Vec2;

        for (const point of this.pathData) {
            maxCoords = { x: Math.max(maxCoords.x, point.x), y: Math.max(maxCoords.y, point.y) } as Vec2;
            minCoords = { x: Math.min(minCoords.x, point.x), y: Math.min(minCoords.y, point.y) } as Vec2;
        }

        return [minCoords, maxCoords];
    }

    // No need here
    executeCommand(command: ToolCommand): void {
        return;
    }
}