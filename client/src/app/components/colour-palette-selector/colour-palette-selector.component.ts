import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'app-colour-palette-selector',
    templateUrl: './colour-palette-selector.component.html',
    styleUrls: ['./colour-palette-selector.component.scss'],
})
export class ColourPaletteSelectorComponent implements AfterViewInit, OnChanges {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/

    @Input() hue: string;
    @Output() selectedColor: EventEmitter<string> = new EventEmitter(true);
    @ViewChild('paletteCanvas') paletteCanvas: ElementRef<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D;
    private mousedown: boolean = false;
    selectedPosition: { x: number; y: number };

    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        const RGBA_WHITE = 'rgba(255,255,255,1)';
        const TRANSPARENT_RGBA_WHITE = 'rgba(255,255,255,0)';
        const RGBA_BLACK = 'rgba(0,0,0,1)';
        const TRANSPARENT_RGBA_BLACK = 'rgba(0,0,0,0)';
        if (!this.canvasContext) {
            const CONTEXT = this.paletteCanvas.nativeElement.getContext('2d');
            if (CONTEXT != null) {
                this.canvasContext = CONTEXT;
            }
        }
        const WIDTH = this.paletteCanvas.nativeElement.width;
        const HEIGHT = this.paletteCanvas.nativeElement.height;

        this.canvasContext.fillStyle = this.hue || RGBA_WHITE;
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const whiteGrad = this.canvasContext.createLinearGradient(0, 0, WIDTH, 0);
        whiteGrad.addColorStop(0, RGBA_WHITE);
        whiteGrad.addColorStop(1, TRANSPARENT_RGBA_WHITE);

        this.canvasContext.fillStyle = whiteGrad;
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const blackGrad = this.canvasContext.createLinearGradient(0, 0, 0, HEIGHT);
        blackGrad.addColorStop(0, TRANSPARENT_RGBA_BLACK);
        blackGrad.addColorStop(1, RGBA_BLACK);

        this.canvasContext.fillStyle = blackGrad;
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        this.drawSelector();
    }

    private drawSelector(): void {
        if (this.selectedPosition != undefined) {
            const SELECTOR_COLOR = 'white';
            const SELECTOR_RADIUS = 10;
            const STROKE_WIDTH = 5;
            this.canvasContext.strokeStyle = SELECTOR_COLOR;
            this.canvasContext.fillStyle = SELECTOR_COLOR;
            this.canvasContext.beginPath();
            this.canvasContext.arc(this.selectedPosition.x, this.selectedPosition.y, SELECTOR_RADIUS, 0, 2 * Math.PI);
            this.canvasContext.lineWidth = STROKE_WIDTH;
            this.canvasContext.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const HUE_STRING = 'hue';
        if (changes[HUE_STRING]) {
            this.draw();
            if (this.selectedPosition != undefined) {
                this.selectedColor.emit(this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.mousedown = false;
    }

    onMouseDown(mouseEvent: MouseEvent): void {
        this.mousedown = true;
        this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        this.draw();
        this.selectedColor.emit(this.getColorAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        if (this.mousedown) {
            this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
            this.draw();
            this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
        }
    }

    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.selectedColor.emit(rgbaColor);
    }

    getColorAtPosition(x: number, y: number): string {
        const IMAGE_DATA = this.canvasContext.getImageData(x, y, 1, 1).data;
        const RGBA_START = 'rgba(';
        const RGBA_ALPHA = ',1)';
        const RGBA_SEPARATOR = ',';
        return RGBA_START + IMAGE_DATA[0] + RGBA_SEPARATOR + IMAGE_DATA[1] + RGBA_SEPARATOR + IMAGE_DATA[2] + RGBA_ALPHA;
    }
}
