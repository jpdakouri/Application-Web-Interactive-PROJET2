import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
// import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/components/drawing/drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];
    private color: string;
    private width: number;
    private radius: number;
    private DEFAULT_SIZE: number = 50;
    private DEFAULT_RADIUS: number = 50 / 3;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = this.DEFAULT_SIZE;
        this.color = 'purple';
        this.radius = this.DEFAULT_RADIUS;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseOut = false;
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
            if (!this.mouseOut) {
                this.drawDot(this.drawingService.baseCtx, this.pathData);
            } else {
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            }
        }
        this.mouseOut = false;
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.mouseOut = true;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.pathData.push(this.getPositionFromMouse(event));
        this.drawLine(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
        this.drawingService.previewCtx.beginPath();
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawDot(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width / 3;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
