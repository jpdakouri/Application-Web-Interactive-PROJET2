import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AerosolCommand } from '@app/classes/tool-commands/aerosol-command';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import {
    DEFAULT_DROPLET_DIAMETER,
    DEFAULT_FREQUENCY,
    DEFAULT_JET_DIAMETER,
    DOTS_PER_SPRAY,
    MIN_DROPLET_DIAMETER,
    MIN_FREQUENCY,
    MIN_JET_DIAMETER,
    MS_PER_S,
} from '@app/services/tools/tools-constants';
import { UndoRedoService } from '@app/services/tools/undo-redo-service/undo-redo.service';
import { MouseButtons } from '@app/utils/enums/mouse-button-pressed';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    private intervalID: number;
    private mouseCurrentPosition: Vec2;
    private isSpraying: boolean;
    private commandSprayLocations: Vec2[];
    private undoRedo: UndoRedoService;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService, undoRedo: UndoRedoService) {
        super(drawingService, currentColourService);
        this.frequency = DEFAULT_FREQUENCY;
        this.dropletDiameter = DEFAULT_DROPLET_DIAMETER;
        this.jetDiameter = DEFAULT_JET_DIAMETER;
        this.isSpraying = false;
        this.mouseCurrentPosition = { x: 0, y: 0 };
        this.commandSprayLocations = [];
        this.undoRedo = undoRedo;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        this.isSpraying = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown && this.isSpraying) {
            this.commandSprayLocations = [];
            this.spray();
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.isSpraying = false;
        if (this.mouseDown) {
            window.clearInterval(this.intervalID);
            this.mouseDown = false;
        }
        const command = new AerosolCommand(
            this,
            this.currentColourService.getPrimaryColorRgba(),
            this.commandSprayLocations,
            this.dropletDiameter || MIN_DROPLET_DIAMETER,
        );
        this.undoRedo.addCommand(command);
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseCurrentPosition = this.getPositionFromMouse(event);
    }

    onMouseLeave(event: MouseEvent): void {
        window.clearInterval(this.intervalID);
        this.isSpraying = false;
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            this.isSpraying = true;
            this.spray();
        }
    }

    private async spray(): Promise<void> {
        window.clearInterval(this.intervalID);
        this.intervalID = window.setInterval(() => {
            this.generateSprayParticles();
        }, (MS_PER_S * DOTS_PER_SPRAY) / (this.frequency || MIN_FREQUENCY));
    }

    private generateSprayParticles(): void {
        for (let i = 0; i < DOTS_PER_SPRAY; i++) {
            const offset = this.getRandomOffsetInRadius((this.jetDiameter || MIN_JET_DIAMETER) / 2);
            const radius = this.dropletDiameter || MIN_DROPLET_DIAMETER;
            const currentPosition = this.mouseCurrentPosition;
            const particlePosition = { x: currentPosition.x + offset.x, y: currentPosition.y + offset.y };
            this.commandSprayLocations.push(particlePosition);
            this.drawSprayParticle(this.drawingService.baseCtx, particlePosition, this.currentColourService.getPrimaryColorRgba(), radius);
        }
    }

    private getRandomOffsetInRadius(radius: number): Vec2 {
        const randomAngle = Math.random() * (2 * Math.PI);
        const randomRadius = Math.random() * radius;
        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius,
        };
    }

    private drawSprayParticle(ctx: CanvasRenderingContext2D, position: Vec2, color: string, radius: number): void {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(position.x, position.y, radius, radius);
    }

    executeCommand(command: AerosolCommand): void {
        command.particleLocations.forEach((location) => {
            this.drawSprayParticle(this.drawingService.baseCtx, location, command.primaryColor, command.particleSize);
        });
    }
}
