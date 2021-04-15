import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/components/components-constants';
import { CurrentColorService } from '@app/services/current-color/current-color.service';
@Component({
    selector: 'app-color-palette-selector',
    templateUrl: './color-palette-selector.component.html',
    styleUrls: ['./color-palette-selector.component.scss'],
})
export class ColorPaletteSelectorComponent implements AfterViewInit, OnChanges {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/

    @Input() hue: string;
    @ViewChild('paletteCanvas') paletteCanvas: ElementRef<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D;
    private mousedown: boolean;
    private selectedPosition: Vec2;

    constructor(private currentColorService: CurrentColorService) {
        this.mousedown = false;
    }

    ngAfterViewInit(): void {
        this.draw();
    }

    private draw(): void {
        if (this.canvasContext == undefined && this.paletteCanvas != undefined) {
            const context = this.paletteCanvas.nativeElement.getContext('2d');
            if (context != null) {
                this.canvasContext = context;
            }
        }

        if (this.canvasContext != undefined) {
            const width = this.paletteCanvas.nativeElement.width;
            const height = this.paletteCanvas.nativeElement.height;

            this.canvasContext.fillStyle = this.hue || Colors.RGBA_WHITE;
            this.canvasContext.fillRect(0, 0, width, height);

            const whiteGrad = this.canvasContext.createLinearGradient(0, 0, width, 0);
            whiteGrad.addColorStop(0, Colors.RGBA_WHITE);
            whiteGrad.addColorStop(1, Colors.TRANSPARENT_RGBA_WHITE);

            this.canvasContext.fillStyle = whiteGrad;
            this.canvasContext.fillRect(0, 0, width, height);

            const blackGrad = this.canvasContext.createLinearGradient(0, 0, 0, height);
            blackGrad.addColorStop(0, Colors.TRANSPARENT_RGBA_BLACK);
            blackGrad.addColorStop(1, Colors.RGBA_BLACK);

            this.canvasContext.fillStyle = blackGrad;
            this.canvasContext.fillRect(0, 0, width, height);

            this.drawSelector();
        }
    }

    private drawSelector(): void {
        if (this.selectedPosition != undefined) {
            const selectorColor = 'white';
            const selectorRadius = 10;
            const strokeRadius = 5;
            this.canvasContext.strokeStyle = selectorColor;
            this.canvasContext.fillStyle = selectorColor;
            this.canvasContext.beginPath();
            this.canvasContext.arc(this.selectedPosition.x, this.selectedPosition.y, selectorRadius, 0, 2 * Math.PI);
            this.canvasContext.lineWidth = strokeRadius;
            this.canvasContext.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const hueString = 'hue';
        if (changes[hueString]) {
            this.draw();
        }
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(mouseEvent: MouseEvent): void {
        this.mousedown = false;
        if (mouseEvent.button === 0) this.currentColorService.setPrimaryColorRgb(this.getRgbAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
        else this.currentColorService.setSecondaryColorRgb(this.getRgbAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
    }

    onMouseDown(mouseEvent: MouseEvent): void {
        this.mousedown = true;
        this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        this.draw();
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        if (this.mousedown) {
            this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
            this.draw();
        }
    }

    private getRgbAtPosition(x: number, y: number): string {
        const imageData = this.canvasContext.getImageData(x, y, 1, 1).data;
        const rgbaSeperator = ',';
        return imageData[0] + rgbaSeperator + imageData[1] + rgbaSeperator + imageData[2];
    }

    @HostListener('contextmenu', ['$event'])
    removeChromeContextMenu(): boolean {
        return false;
    }
}
