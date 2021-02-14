import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import {
    SELECTOR_COLOR,
    SELECTOR_OUTLINE_COLOR,
    SELECTOR_OUTLINE_OFFSET_3PX,
    SELECTOR_OUTLINE_OFFSET_6PX,
    SELECTOR_OUTLINE_TOP_LEFT_X,
    SELECTOR_OUTLINE_WIDTH,
    SELECTOR_WIDTH,
} from './hue-selector-constants';
@Component({
    selector: 'app-hue-selector',
    templateUrl: './hue-selector.component.html',
    styleUrls: ['./hue-selector.component.scss'],
})
export class HueSelectorComponent implements AfterViewInit {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/

    @ViewChild('sliderCanvas') sliderCanvas: ElementRef<HTMLCanvasElement>;
    @Output() color: EventEmitter<string> = new EventEmitter();
    private sliderCanvasContext: CanvasRenderingContext2D;
    private isMouseDown: boolean = false;
    private selectedHeight: number = 1;

    ngAfterViewInit(): void {
        this.draw();
    }

    private draw(): void {
        if (!this.sliderCanvasContext) {
            const CONTEXT = this.sliderCanvas.nativeElement.getContext('2d');
            if (CONTEXT != null) {
                this.sliderCanvasContext = CONTEXT;
            }
        }
        const CANVAS_WIDTH = this.sliderCanvas.nativeElement.width;
        const CANVAS_HEIGHT = this.sliderCanvas.nativeElement.height;

        this.sliderCanvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.sliderCanvasContext.beginPath();
        this.sliderCanvasContext.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.sliderCanvasContext.fillStyle = this.generateGradient();
        this.sliderCanvasContext.fill();
        this.sliderCanvasContext.closePath();
        this.drawWholeSelector();
    }

    private drawWholeSelector(): void {
        this.drawSelectorWhiteInterior();
        this.drawSelectorBlackOutline();
        this.drawSelectorInteriorBlackOutline();
    }

    private drawSelectorWhiteInterior(): void {
        this.sliderCanvasContext.beginPath();
        this.sliderCanvasContext.strokeStyle = SELECTOR_COLOR;
        this.sliderCanvasContext.lineWidth = SELECTOR_WIDTH;
        this.sliderCanvasContext.rect(0, this.selectedHeight - SELECTOR_WIDTH, this.sliderCanvas.nativeElement.width, SELECTOR_WIDTH * 2);
        this.sliderCanvasContext.stroke();
        this.sliderCanvasContext.closePath();
    }

    private drawSelectorBlackOutline(): void {
        this.sliderCanvasContext.beginPath();
        this.sliderCanvasContext.strokeStyle = SELECTOR_OUTLINE_COLOR;
        this.sliderCanvasContext.lineWidth = SELECTOR_OUTLINE_WIDTH;
        this.sliderCanvasContext.rect(
            SELECTOR_OUTLINE_TOP_LEFT_X,
            this.selectedHeight - SELECTOR_WIDTH - SELECTOR_OUTLINE_OFFSET_3PX,
            this.sliderCanvas.nativeElement.width + 2,
            SELECTOR_WIDTH * 2 + SELECTOR_OUTLINE_OFFSET_6PX,
        );
        this.sliderCanvasContext.stroke();
        this.sliderCanvasContext.closePath();
    }

    private drawSelectorInteriorBlackOutline(): void {
        this.sliderCanvasContext.beginPath();
        this.sliderCanvasContext.strokeStyle = SELECTOR_OUTLINE_COLOR;
        this.sliderCanvasContext.lineWidth = SELECTOR_OUTLINE_WIDTH;
        this.sliderCanvasContext.rect(
            SELECTOR_OUTLINE_OFFSET_3PX,
            this.selectedHeight - SELECTOR_WIDTH + SELECTOR_OUTLINE_OFFSET_3PX,
            this.sliderCanvas.nativeElement.width - SELECTOR_OUTLINE_OFFSET_6PX,
            SELECTOR_WIDTH * 2 - SELECTOR_OUTLINE_OFFSET_6PX,
        );
        this.sliderCanvasContext.stroke();
        this.sliderCanvasContext.closePath();
    }
    
    private generateGradient(): CanvasGradient {
        const GRADIENT = this.sliderCanvasContext.createLinearGradient(0, 0, 0, this.sliderCanvas.nativeElement.height);
        const RGBA_RED = 'rgba(255, 0, 0, 1)';
        const RGBA_YELLOW = 'rgba(255, 255, 0, 1)';
        const RGBA_GREEN = 'rgba(0, 255, 0, 1)';
        const RGBA_CYAN = 'rgba(0, 255, 255, 1)';
        const RGBA_BLUE = 'rgba(0, 0, 255, 1)';
        const RGBA_PURPLE = 'rgba(255, 0, 255, 1)';

        let gradientPartCount = 0;
        const GRADIENT_PARTS = 6;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_RED);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_YELLOW);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_GREEN);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_CYAN);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_BLUE);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_PURPLE);
        gradientPartCount++;
        GRADIENT.addColorStop(gradientPartCount / GRADIENT_PARTS, RGBA_RED);
        return GRADIENT;
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.isMouseDown = false;
    }

    onMouseDown(mouseEvent: MouseEvent): void {
        this.isMouseDown = true;
        this.selectedHeight = mouseEvent.offsetY;
        this.draw();
        if (this.isValidPosition(mouseEvent.offsetX, mouseEvent.offsetY)) this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        if (this.isMouseDown && this.isValidPosition(mouseEvent.offsetX, mouseEvent.offsetY)) {
            this.selectedHeight = mouseEvent.offsetY;
            this.draw();
            this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
        }
    }

    private isValidPosition(x: number, y: number): boolean {
        const EXCLUDED_SIDE_WIDTH = 5;
        console.log(x, y);
        return (
            x >= EXCLUDED_SIDE_WIDTH &&
            x <= this.sliderCanvas.nativeElement.width - EXCLUDED_SIDE_WIDTH &&
            y >= EXCLUDED_SIDE_WIDTH &&
            y <= this.sliderCanvas.nativeElement.height - EXCLUDED_SIDE_WIDTH
        );
    }

    private emitColor(x: number, y: number): void {
        const RGBA_COLOR = this.getColorAtPosition(x, y);
        this.color.emit(RGBA_COLOR);
    }

    private getColorAtPosition(x: number, y: number): string {
        const IMAGE_DATA = this.sliderCanvasContext.getImageData(x, y, 1, 1).data;
        const RGBA_START = 'rgba(';
        const RGBA_ALPHA = ',1)';
        return RGBA_START + IMAGE_DATA[0] + ',' + IMAGE_DATA[1] + ',' + IMAGE_DATA[2] + RGBA_ALPHA;
    }
}
