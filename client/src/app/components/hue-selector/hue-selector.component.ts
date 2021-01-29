import {Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter} from '@angular/core'

@Component({
  selector: 'app-hue-selector',
  templateUrl: './hue-selector.component.html',
  styleUrls: ['./hue-selector.component.scss']
})
export class HueSelectorComponent implements AfterViewInit {
  @ViewChild('sliderCanvas') sliderCanvas: ElementRef<HTMLCanvasElement>;

  @Output() color: EventEmitter<string> = new EventEmitter();

  private sliderCanvasContext: CanvasRenderingContext2D;
  private isMouseDown = false;
  private selectedHeight = 1;

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
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
    this.drawSelector();
  }

  private drawSelector(): void {
    const SELECTOR_WIDTH = 5;
    const SELECTOR_COLOR = 'white';

    this.sliderCanvasContext.beginPath();
    this.sliderCanvasContext.strokeStyle = SELECTOR_COLOR;
    this.sliderCanvasContext.lineWidth = SELECTOR_WIDTH;
    this.sliderCanvasContext.rect(0, this.selectedHeight - SELECTOR_WIDTH, this.sliderCanvas.nativeElement.width, SELECTOR_WIDTH * 2);
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
    const RGBA_PURPLE = 'rgba(255, 0, 0, 1)';

    
    GRADIENT.addColorStop(0, RGBA_RED);
    GRADIENT.addColorStop(0.17, RGBA_YELLOW);
    GRADIENT.addColorStop(0.34, RGBA_GREEN);
    GRADIENT.addColorStop(0.51, RGBA_CYAN);
    GRADIENT.addColorStop(0.68, RGBA_BLUE);
    GRADIENT.addColorStop(0.85, RGBA_PURPLE);
    GRADIENT.addColorStop(1, RGBA_RED);
    return GRADIENT;
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.isMouseDown = false;
  }

  onMouseDown(mouseEvent: MouseEvent) {
    this.isMouseDown = true;
    this.selectedHeight = mouseEvent.offsetY;
    this.draw();
    this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
  }

  onMouseMove(mouseEvent: MouseEvent) {
    if (this.isMouseDown) {
      this.selectedHeight = mouseEvent.offsetY;
      this.draw();
      this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number) {
    const IMAGE_DATA = this.sliderCanvasContext.getImageData(x, y, 1, 1).data;
    const RGBA_START = 'rgba(';
    const RGBA_ALPHA = ',1)';
    return (RGBA_START + IMAGE_DATA[0] + ',' + IMAGE_DATA[1] + ',' + IMAGE_DATA[2] + RGBA_ALPHA);
  }
}