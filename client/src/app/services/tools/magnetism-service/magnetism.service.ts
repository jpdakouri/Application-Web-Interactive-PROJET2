import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MousePositionHandlerService } from '@app/services/tools/mouse-position-handler-service/mouse-position-handler.service';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export enum controlPoints {
    topLeft = 'topLeft',
    topRight = 'topRight',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
    midLeft = 'midLeft',
    midTop = 'midTop',
    midRight = 'midRight',
    midBottom = 'bmidBottom',
}
const RANGE = 30;

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends Tool {
    private resizers: Map<controlPoints, Vec2>;

    gridSize: number;
    lastPosition: Vec2;
    mousePositionHandler: MousePositionHandlerService;
    currentSelection: CanvasRenderingContext2D;
    constructor(drawingService: DrawingService, currentColor: CurrentColorService, mousePositionHandler: MousePositionHandlerService) {
        super(drawingService, currentColor);
        this.mousePositionHandler = mousePositionHandler;
        this.currentSelection = this.drawingService.baseCtx;
        this.resizers = new Map<controlPoints, Vec2>();
        this.resizers
            .set(controlPoints.topLeft, {
                x: this.currentSelection.canvas.offsetLeft,
                y: this.currentSelection.canvas.offsetTop,
            })
            .set(controlPoints.topRight, {
                x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
                y: this.currentSelection.canvas.offsetTop,
            })
            .set(controlPoints.bottomLeft, {
                x: this.currentSelection.canvas.offsetLeft,
                y: this.currentSelection.canvas.offsetTop + this.currentSelection.canvas.height,
            })
            .set(controlPoints.bottomRight, {
                x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
                y: this.currentSelection.canvas.offsetTop + this.currentSelection.canvas.height,
            })
            .set(controlPoints.midLeft, {
                x: this.currentSelection.canvas.offsetLeft,
                y: this.currentSelection.canvas.offsetTop + (1 / 2) * this.currentSelection.canvas.height,
            })
            .set(controlPoints.midTop, {
                x: this.currentSelection.canvas.offsetLeft + (1 / 2) * this.currentSelection.canvas.width,
                y: this.currentSelection.canvas.offsetTop,
            })
            .set(controlPoints.midRight, {
                x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
                y: this.currentSelection.canvas.offsetTop + (1 / 2) * this.currentSelection.canvas.height,
            })
            .set(controlPoints.midBottom, {
                x: this.currentSelection.canvas.offsetLeft + (1 / 2) * this.currentSelection.canvas.width,
                y: this.currentSelection.canvas.offsetTop + this.currentSelection.canvas.height,
            });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            console.log('test');
            this.verifyInRangeCross(this.getPositionFromMouse(event));
        }
    }

    startKeys(ctx: CanvasRenderingContext2D): void {
        console.log('Magnetism Start');

        this.currentSelection = ctx;
        this.gridSize = this.drawingService.gridSize;
        this.lastPosition = { x: ctx.canvas.offsetLeft, y: ctx.canvas.offsetTop };
        this.updatePosition(this.gridSize);
    }

    findNearestLineRight(): void {
        const topRightCornerX = this.currentSelection.canvas.width + this.currentSelection.canvas.offsetLeft;
        const kThGrid = Math.floor(topRightCornerX / this.gridSize) + 1;
        const num = kThGrid * this.gridSize - topRightCornerX + this.currentSelection.canvas.offsetLeft;
        // console.log(topRightCornerX);
        // console.log(kThGrid, num + this.currentSelection.canvas.width);
        this.currentSelection.canvas.style.left = num + 'px';
        console.log('rightAfter ' + this.currentSelection.canvas.style.left);
    }

    findNearestLineLeft(): number {
        const kThGrid = Math.floor(this.currentSelection.canvas.offsetLeft / this.gridSize);
        const num = kThGrid * this.gridSize;
        // console.log(this.currentSelection.canvas.offsetLeft);
        // console.log(kThGrid, num);
        // this.currentSelection.canvas.style.left = num + 'px';
        return num;
        // this.currentSelection.translate(num - this.currentSelection.canvas.offsetLeft, 0);
        // console.log(' in left ' + this.currentSelection.canvas.offsetLeft);
        // this.currentSelection.canvas.style.left = num;
    }

    findNearestLineTop(): number {
        const kThGrid = Math.floor(this.currentSelection.canvas.offsetTop / this.gridSize);
        const num = kThGrid * this.gridSize;
        // console.log(this.currentSelection.canvas.offsetTop);
        // console.log(kThGrid, num);
        // this.currentSelection.canvas.style.top = num + 'px';
        return num;
    }

    findNearestLineDown(): void {
        const bottom = this.currentSelection.canvas.height + this.currentSelection.canvas.offsetTop;
        const kThGrid = Math.floor(bottom / this.gridSize) + 1;
        const num = this.currentSelection.canvas.offsetTop - bottom + kThGrid * this.gridSize;
        // console.log(bottom);
        // console.log(kThGrid, num + this.currentSelection.canvas.height);
        this.currentSelection.canvas.style.left = num + 'px';
    }

    updatePosition(grid: number): void {
        this.gridSize = grid;
        this.currentSelection.canvas.style.left = this.lastPosition.x + 'px';
        this.currentSelection.canvas.style.top = this.lastPosition.y + 'px';
        this.findNearestLineLeft();
        this.findNearestLineTop();
    }

    isMouseOnTopLeftCorner(mouseCoord: Vec2): boolean {
        const topLeftCorner = { x: this.currentSelection.canvas.offsetLeft, y: this.currentSelection.canvas.offsetTop };

        return (
            topLeftCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < topLeftCorner.x + RANGE &&
            topLeftCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < topLeftCorner.y + RANGE
        );
    }

    isMouseOnTopRightCorner(mouseCoord: Vec2): boolean {
        const topRightCorner = {
            x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
            y: this.currentSelection.canvas.height,
        };

        return (
            topRightCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < topRightCorner.x + RANGE &&
            topRightCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < topRightCorner.y + RANGE
        );
    }

    isMouseOnBottomLeftCorner(mouseCoord: Vec2): boolean {
        const bottomLeftCorner = {
            x: this.currentSelection.canvas.offsetLeft,
            y: this.currentSelection.canvas.height + this.currentSelection.canvas.height,
        };

        return (
            bottomLeftCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < bottomLeftCorner.x + RANGE &&
            bottomLeftCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < bottomLeftCorner.y + RANGE
        );
    }

    isMouseOnBottomRightCorner(mouseCoord: Vec2): boolean {
        const bottomRightCorner = {
            x: this.currentSelection.canvas.offsetLeft + this.currentSelection.canvas.width,
            y: this.currentSelection.canvas.height + this.currentSelection.canvas.height,
        };

        return (
            bottomRightCorner.x - RANGE < mouseCoord.x &&
            mouseCoord.x < bottomRightCorner.x + RANGE &&
            bottomRightCorner.y - RANGE < mouseCoord.y &&
            mouseCoord.y < bottomRightCorner.y + RANGE
        );
    }

    verifyInRangeCross(mouseCoord: Vec2): boolean {
        return Math.abs(mouseCoord.x) <= RANGE && Math.abs(mouseCoord.y) <= RANGE;
    }

    setCoordToNearestCrossOnGrid(mouseCoord: Vec2): void {
        const nearestCross = {
            x: this.gridSize * Math.floor(mouseCoord.x / this.gridSize),
            y: this.gridSize * Math.floor(mouseCoord.y / this.gridSize),
        };

        const distance = Math.hypot(nearestCross.x - mouseCoord.x, nearestCross.y - mouseCoord.y);
        if (distance <= 2) {
            console.log('distance ' + distance);
            // console.log('we in this bitch nigga');
            this.currentSelection.canvas.style.left = nearestCross.x + 'px';
            this.currentSelection.canvas.style.top = nearestCross.y + 'px';
        }
        return;
    }

    cornerCurrentlySelected(mouseCoord: Vec2): controlPoints {
        if (this.isMouseOnTopLeftCorner(mouseCoord)) {
            return controlPoints.topLeft;
        }
        if (this.isMouseOnTopRightCorner(mouseCoord)) {
            return controlPoints.topRight;
        }
        if (this.isMouseOnBottomLeftCorner(mouseCoord)) {
            return controlPoints.bottomLeft;
        }
        if (this.isMouseOnBottomRightCorner(mouseCoord)) {
            return controlPoints.bottomRight;
        }
        // À revoir
        return controlPoints.bottomLeft;
    }

    bringToClosestCrossOnGrid(mouseCoord: Vec2, corner: controlPoints): void {
        switch (corner) {
            case controlPoints.topLeft:
                this.setCoordToNearestCrossOnGrid(mouseCoord);
                break;
            case controlPoints.topRight:
                this.setCoordToNearestCrossOnGrid(mouseCoord);
                break;
            case controlPoints.bottomLeft:
                this.setCoordToNearestCrossOnGrid(mouseCoord);
                break;
            case controlPoints.bottomRight:
                this.setCoordToNearestCrossOnGrid(mouseCoord);
                break;
            default:
                break;
        }
    }

    executeCommand(command: ToolCommand): void {
        throw new Error('Method not implemented.');
    }

    registerUndo(imageData: ImageData): void {
        throw new Error('Method not implemented.');
    }
}
