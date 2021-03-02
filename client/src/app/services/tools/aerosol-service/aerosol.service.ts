import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
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
import { MouseButtons } from '@app/utils/enums/list-boutton-pressed';

@Injectable({
    providedIn: 'root',
})
// TODO : set method use only here as private
// TODO : remove #console.log
export class AerosolService extends Tool {
    private intervalID: number;
    private mouseCurrentPosition: Vec2;
    private isSpraying: boolean;

    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        this.frequency = DEFAULT_FREQUENCY;
        this.dropletDiameter = DEFAULT_DROPLET_DIAMETER;
        this.jetDiameter = DEFAULT_JET_DIAMETER;
        this.isSpraying = false;
        this.mouseCurrentPosition = { x: 0, y: 0 };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        this.isSpraying = true;
        if (this.mouseDown && this.isSpraying) {
            this.printSpray();
        }
    }

    onMouseUp(event: MouseEvent): void {
        console.log('mouse up');
        this.isSpraying = false;
        if (this.mouseDown) {
            window.clearInterval(this.intervalID);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseCurrentPosition = this.getPositionFromMouse(event);
    }

    onMouseLeave(event: MouseEvent): void {
        console.log('mouse leave');
        window.clearInterval(this.intervalID);
        this.isSpraying = false;
    }

    onMouseEnter(event: MouseEvent): void {
        console.log('mouse enter');
        if (this.mouseDown) {
            this.isSpraying = true;
            this.printSpray();
        }
    }

    async printSpray(): Promise<void> {
        window.clearInterval(this.intervalID);
        this.intervalID = window.setInterval(() => {
            this.spray();
        }, (MS_PER_S * DOTS_PER_SPRAY) / (this.frequency || MIN_FREQUENCY));
    }

    spray(): void {
        this.generateSprayParticles();
    }

    generateSprayParticles(): void {
        console.count('spray');
        for (let i = 0; i < DOTS_PER_SPRAY; i++) {
            const offset = this.getRandomOffsetInRadius((this.jetDiameter || MIN_JET_DIAMETER) / 2);
            const radius = this.dropletDiameter || MIN_DROPLET_DIAMETER;
            const currentPosition = this.mouseCurrentPosition;
            this.drawingService.baseCtx.strokeStyle = this.currentColourService.getPrimaryColorRgba();
            this.drawingService.baseCtx.fillStyle = this.currentColourService.getPrimaryColorRgba();
            this.drawingService.baseCtx.fillRect(currentPosition.x + offset.x, currentPosition.y + offset.y, radius, radius);
        }
    }

    getRandomOffsetInRadius(radius: number): Vec2 {
        const randomAngle = Math.random() * (2 * Math.PI);
        const randomRadius = Math.random() * radius;
        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius,
        };
    }
}
