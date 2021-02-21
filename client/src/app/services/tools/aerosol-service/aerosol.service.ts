import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MIN_AEROSOL_DROPLET_DIAMETER, MIN_AEROSOL_EMISSION_FLOW, MIN_AEROSOL_JET_DIAMETER } from '@app/services/tools/tools-constants';
import { MouseButtons } from '@app/utils/enums/list-boutton-pressed';

// MIN_FREQUENCY = 10;
// MAX_DROPLET_DIAMETER = 10;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    private sprayInterval: number;
    private interval: number;

    // tslint:disable:no-magic-numbers
    constructor(drawingService: DrawingService, currentColourService: CurrentColourService) {
        super(drawingService, currentColourService);
        // this.isSpraying = false;
        this.emissionFlow = MIN_AEROSOL_EMISSION_FLOW;
        this.dropletDiameter = MIN_AEROSOL_DROPLET_DIAMETER;
        this.jetDiameter = MIN_AEROSOL_JET_DIAMETER;
        this.sprayInterval = 100;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButtons.Left;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDownCoord = this.getPositionFromMouse(event);
            window.clearInterval(this.interval);
            this.spray(event, this.drawingService.baseCtx);
            this.interval = window.setInterval(() => {
                this.spray(event, this.drawingService.baseCtx);
            }, this.sprayInterval);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            window.clearInterval(this.sprayInterval);
        }
        window.clearInterval(this.interval);
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            window.clearInterval(this.interval);
            this.spray(event, this.drawingService.baseCtx);
            this.interval = window.setInterval(() => {
                this.spray(event, this.drawingService.baseCtx);
            }, this.sprayInterval);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.previewCtx.beginPath();
        }
    }

    spray(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
        // @ts-ignore
        // tslint:disable:no-magic-numbers
        const radius = this.dropletDiameter || MIN_AEROSOL_DROPLET_DIAMETER;
        // const radius = 3;
        const jetDiameter = this.jetDiameter || MIN_AEROSOL_JET_DIAMETER;
        const dotsPerTick = this.emissionFlow || MIN_AEROSOL_EMISSION_FLOW;
        const currentPos = this.getPositionFromMouse(event);
        for (let i = 0; i < dotsPerTick / 10; i++) {
            console.log('spray : ');
            const offset = this.getRandomOffset(jetDiameter);
            ctx.strokeStyle = this.currentColourService.getPrimaryColorRgba();
            ctx.fillStyle = this.currentColourService.getPrimaryColorRgba();
            ctx.fillRect(currentPos.x + offset.x, currentPos.y + offset.y, radius, radius);
        }
    }

    generateSprayParticles(): void {}

    getRandomOffset(radius: number): Vec2 {
        const randomAngle = Math.random() * (2 * Math.PI);
        const randomRadius = Math.random() * radius;

        // console.log(randomAngle, randomRadius, Math.cos(randomAngle), Math.sin(randomAngle));

        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius,
        };
    }

    // randomPointInRadius(radius: number): Vec2 {
    //     for (;;) {
    //         const x = Math.random() * 2 - 1;
    //         const y = Math.random() * 2 - 1;
    //         if (x * x + y * y <= 1) return { x: x * radius, y: y * radius };
    //     }
    // }

    // generateSprayParticles(): void {
    //     // Particle count, or, density
    //     const density = 1;
    //
    //     for (let i = 0; i < density; i++) {
    //         const offset = this.getRandomOffset(10);
    //
    //         // let x = mouse.x + offset.x;
    //         // let y = mouse.y + offset.y;
    //
    //         // tmp_ctx.fillRect(x, y, 1, 1);
    //     }
    // }
}
