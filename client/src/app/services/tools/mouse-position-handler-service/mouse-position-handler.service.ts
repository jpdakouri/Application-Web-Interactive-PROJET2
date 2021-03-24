import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Sign } from '@app/utils/enums/rgb-settings';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class MousePositionHandlerService extends Tool {
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
    }

    isMouseInFirstQuadrant(mouseDownCoord: Vec2): boolean {
        //  mouse is in first quadrant (+/+)
        return Math.sign(mouseDownCoord.x) === Sign.Positive && Math.sign(mouseDownCoord.y) === Sign.Positive;
    }

    isMouseInSecondQuadrant(mouseDownCoord: Vec2): boolean {
        // mouse is in third quadrant (-/-)
        return Math.sign(mouseDownCoord.x) === Sign.Negative && Math.sign(mouseDownCoord.y) === Sign.Negative;
    }

    isMouseInThirdQuadrant(mouseDownCoord: Vec2): boolean {
        // mouse is in fourth quadrant (-/+)
        return Math.sign(mouseDownCoord.x) === Sign.Negative && Math.sign(mouseDownCoord.y) === Sign.Positive;
    }

    isMouseInFourthQuadrant(mouseDownCoord: Vec2): boolean {
        // mouse is in second quadrant (+/-)
        return Math.sign(mouseDownCoord.x) === Sign.Positive && Math.sign(mouseDownCoord.y) === Sign.Negative;
    }
    isXGreaterThanY(mouseDownCoord: Vec2): boolean {
        return Math.abs(mouseDownCoord.x) > Math.abs(mouseDownCoord.y);
    }

    isYGreaterThanX(mouseDownCoord: Vec2): boolean {
        return Math.abs(mouseDownCoord.y) > Math.abs(mouseDownCoord.x);
    }

    makeCircle(mouseDownCoord: Vec2, grid: Vec2): void {
        if (this.isMouseInFirstQuadrant(mouseDownCoord)) {
            grid.x = grid.y = Math.min(mouseDownCoord.x, mouseDownCoord.y);
        }

        if (this.isMouseInSecondQuadrant(mouseDownCoord)) {
            grid.x = grid.y = Math.max(mouseDownCoord.x, mouseDownCoord.y);
        }

        if (this.isMouseInThirdQuadrant(mouseDownCoord)) {
            this.isXGreaterThanY(mouseDownCoord) ? (grid.x = -grid.y) : (grid.y = -grid.x);
        }

        if (this.isMouseInFourthQuadrant(mouseDownCoord)) {
            this.isYGreaterThanX(mouseDownCoord) ? (grid.y = -grid.x) : (grid.x = -grid.y);
        }
    }

    makeSquare(mouseDownCoord: Vec2, grid: Vec2): void {
        if (this.isMouseInFirstQuadrant(mouseDownCoord)) {
            grid.x = grid.y = Math.min(mouseDownCoord.x, mouseDownCoord.y);
        }

        if (this.isMouseInSecondQuadrant(mouseDownCoord)) {
            grid.x = grid.y = Math.max(mouseDownCoord.x, mouseDownCoord.y);
        }

        if (this.isMouseInThirdQuadrant(mouseDownCoord)) {
            this.isXGreaterThanY(mouseDownCoord) ? (grid.x = -grid.y) : (grid.y = -grid.x);
        }

        if (this.isMouseInFourthQuadrant(mouseDownCoord)) {
            this.isYGreaterThanX(mouseDownCoord) ? (grid.y = -grid.x) : (grid.x = -grid.y);
        }
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }
}
