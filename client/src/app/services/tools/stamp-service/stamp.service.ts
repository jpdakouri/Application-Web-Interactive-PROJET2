import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { StampCommand } from '@app/classes/tool-commands/stamp-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import {
    BASE_STAMP_IMAGE_PATH,
    BIG_ANGLE_CHANGE,
    DEG_TO_RAD_RATIO,
    SMALL_ANGLE_CHANGE,
    STAMP_IMAGE_EXTENSION,
    STAMP_SIZE,
} from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';
import { Stamp } from '@app/utils/enums/stamp';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    selectedStamp: Stamp;
    private rotationAngle: number;
    private scalingFactor: number;
    private undoRedo: UndoRedoService;
    constructor(drawingService: DrawingService, currentColorService: CurrentColorService, undoRedo: UndoRedoService) {
        super(drawingService, currentColorService);
        this.selectedStamp = Stamp.Letter;
        this.rotationAngle = 0;
        this.scalingFactor = 1;
        this.undoRedo = undoRedo;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButtons.Left) {
            this.drawOnBase(this.rotationAngle, this.scalingFactor, this.getPositionFromMouse(event), this.selectedStamp);
            const command = new StampCommand(this, this.scalingFactor, this.rotationAngle, this.getPositionFromMouse(event), this.selectedStamp);
            this.undoRedo.addCommand(command);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreview(this.rotationAngle, this.scalingFactor, this.getPositionFromMouse(event), this.selectedStamp);
    }

    onMouseWheelScroll(event: WheelEvent): void {
        event.preventDefault();
        if (event.altKey) {
            this.rotationAngle += event.deltaY > 0 ? SMALL_ANGLE_CHANGE : -SMALL_ANGLE_CHANGE;
        } else {
            this.rotationAngle += event.deltaY > 0 ? BIG_ANGLE_CHANGE : -BIG_ANGLE_CHANGE;
        }
        console.log(this.rotationAngle);
    }

    private drawPreview(rotationAngle: number, scalingFactor: number, position: Vec2, stamp: Stamp): void {
        const stampImage = new Image(STAMP_SIZE, STAMP_SIZE);
        stampImage.src = BASE_STAMP_IMAGE_PATH + stamp + STAMP_IMAGE_EXTENSION;
        console.log(BASE_STAMP_IMAGE_PATH + stamp + STAMP_IMAGE_EXTENSION);

        const stampCenter: Vec2 = { x: position.x - STAMP_SIZE / 2, y: position.y - STAMP_SIZE / 2 };

        const centerAngle = Math.atan(stampCenter.y / stampCenter.x);
        const centerDistanceFromOrigin = Math.sqrt(stampCenter.x * stampCenter.x + stampCenter.y * stampCenter.y);

        const correctedAngle = -centerAngle + this.degToRad(rotationAngle);
        this.drawingService.previewCtx.save();
        this.drawingService.previewCtx.rotate(this.degToRad(rotationAngle));
        console.log(centerDistanceFromOrigin);
        this.drawingService.previewCtx.drawImage(
            stampImage,
            centerDistanceFromOrigin * Math.cos(correctedAngle),
            centerDistanceFromOrigin * Math.sin(correctedAngle),
        );
        this.drawingService.previewCtx.restore();
    }

    private drawOnBase(rotationAngle: number, scalingFactor: number, position: Vec2, stamp: Stamp): void {
        this.drawPreview(rotationAngle, scalingFactor, position, stamp);
    }

    private degToRad(angle: number): number {
        return angle * DEG_TO_RAD_RATIO;
    }

    executeCommand(command: StampCommand): void {
        this.drawOnBase(command.rotationAngle, command.scalingFactor, command.center, command.stamp);
    }
}
