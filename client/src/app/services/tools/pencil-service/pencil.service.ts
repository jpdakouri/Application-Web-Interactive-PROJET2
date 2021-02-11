import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/list-boutton-pressed';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DEFAULT_COLOR_BLACK, DEFAULT_MIN_THICKNESS } from '@app/services/tools/tools-constants';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];
    private radius: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.radius = this.lineThickness ? this.lineThickness : 1;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseMoved = false;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            if (!this.mouseMoved) {
                this.drawDot(this.drawingService.baseCtx, this.pathData[0]);
            } else {
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            }
        }
        // this.mouseMoved = false;
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.mouseMoved = true;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.pathData.push(this.getPositionFromMouse(event));
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
            this.drawingService.previewCtx.beginPath();
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.primaryColor || DEFAULT_COLOR_BLACK;
        ctx.lineCap = 'round';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawDot(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.lineWidth = this.lineThickness || DEFAULT_MIN_THICKNESS;
        ctx.strokeStyle = this.primaryColor || DEFAULT_COLOR_BLACK;
        ctx.fillStyle = this.primaryColor || DEFAULT_COLOR_BLACK;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
