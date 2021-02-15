import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RGBA_BLACK, RGBA_WHITE, TRANSPARENT_RGBA_BLACK, TRANSPARENT_RGBA_WHITE } from '@app/components/components-constants';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
@Component({
    selector: 'app-colour-palette-selector',
    templateUrl: './colour-palette-selector.component.html',
    styleUrls: ['./colour-palette-selector.component.scss'],
})
export class ColourPaletteSelectorComponent implements AfterViewInit, OnChanges {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/

    @Input() hue: string;
    @ViewChild('paletteCanvas') paletteCanvas: ElementRef<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D;
    private mousedown: boolean = false;
    private selectedPosition: { x: number; y: number };

    constructor(private currentColourService: CurrentColourService) {}

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

            this.canvasContext.fillStyle = this.hue || RGBA_WHITE;
            this.canvasContext.fillRect(0, 0, width, height);

            const whiteGrad = this.canvasContext.createLinearGradient(0, 0, width, 0);
            whiteGrad.addColorStop(0, RGBA_WHITE);
            whiteGrad.addColorStop(1, TRANSPARENT_RGBA_WHITE);

            this.canvasContext.fillStyle = whiteGrad;
            this.canvasContext.fillRect(0, 0, width, height);

            const blackGrad = this.canvasContext.createLinearGradient(0, 0, 0, height);
            blackGrad.addColorStop(0, TRANSPARENT_RGBA_BLACK);
            blackGrad.addColorStop(1, RGBA_BLACK);

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
        if (mouseEvent.button === 0) this.currentColourService.setPrimaryColorRgb(this.getRgbAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
        else this.currentColourService.setSecondaryColorRgb(this.getRgbAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
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
