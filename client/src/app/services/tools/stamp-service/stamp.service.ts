import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { StampCommand } from '@app/classes/tool-commands/stamp-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BASE_STAMP_IMAGE_PATH, BIG_ANGLE_CHANGE, SMALL_ANGLE_CHANGE, STAMP_IMAGE_EXTENSION, STAMP_SIZE } from '@app/services/tools/tools-constants';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Stamp } from '@app/utils/enums/stamp';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    selectedStamp: Stamp;
    private rotationAngle: number;
    private scalingFactor: number;
    private altPressed: boolean;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService) {
        super(drawingService, currentColorService);
        this.selectedStamp = Stamp.House;
        this.rotationAngle = 0;
        this.scalingFactor = 1;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButtons.Left) {
            this.drawStamp(this.drawingService.baseCtx, this.rotationAngle, this.scalingFactor, this.getPositionFromMouse(event));
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawStamp(this.drawingService.previewCtx, this.rotationAngle, this.scalingFactor, this.getPositionFromMouse(event));
    }

    onMouseWheelScroll(event: WheelEvent): void {
        if (this.altPressed) {
            this.rotationAngle += event.deltaY > 0 ? SMALL_ANGLE_CHANGE : -SMALL_ANGLE_CHANGE;
        } else {
            this.rotationAngle += event.deltaY > 0 ? BIG_ANGLE_CHANGE : -BIG_ANGLE_CHANGE;
        }
        console.log(this.rotationAngle);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.altPressed = event.altKey;
    }

    onKeyUp(event: KeyboardEvent): void {
        this.altPressed = event.altKey;
    }

    private drawStamp(ctx: CanvasRenderingContext2D, rotationAngle: number, scalingFactor: number, position: Vec2): void {
        const stampImage = new Image(STAMP_SIZE, STAMP_SIZE);
        stampImage.src = BASE_STAMP_IMAGE_PATH + this.selectedStamp + STAMP_IMAGE_EXTENSION;
    }

    executeCommand(command: StampCommand): void {
        this.drawStamp(this.drawingService.baseCtx, command.rotationAngle, command.scalingFactor, command.center);
    }
}
