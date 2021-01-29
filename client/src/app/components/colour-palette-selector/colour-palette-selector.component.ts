import {Component, ViewChild, ElementRef, AfterViewInit, Input, Output,SimpleChanges,
  OnChanges, EventEmitter, HostListener} from '@angular/core'

@Component({
  selector: 'app-colour-palette-selector',
  templateUrl: './colour-palette-selector.component.html',
  styleUrls: ['./colour-palette-selector.component.scss']
})
export class ColourPaletteSelectorComponent implements AfterViewInit, OnChanges {
  // Code inspiré par https://malcoded.com/posts/angular-color-picker/
  
  @Input() hue: string;
  @Output() selectedColor: EventEmitter<string> = new EventEmitter(true);
  @ViewChild('paletteCanvas') paletteCanvas: ElementRef<HTMLCanvasElement>;
  private canvasContext: CanvasRenderingContext2D;
  private mousedown = false;
  selectedPosition: { x: number; y: number }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    if (!this.canvasContext) {
      const CONTEXT = this.paletteCanvas.nativeElement.getContext('2d');
      if (CONTEXT != null) {
        this.canvasContext = CONTEXT;
      }
    }
    const width = this.paletteCanvas.nativeElement.width;
    const height = this.paletteCanvas.nativeElement.height;

    this.canvasContext.fillStyle = this.hue || 'rgba(255,255,255,1)';
    this.canvasContext.fillRect(0, 0, width, height);

    const whiteGrad = this.canvasContext.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.canvasContext.fillStyle = whiteGrad;
    this.canvasContext.fillRect(0, 0, width, height);

    const blackGrad = this.canvasContext.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.canvasContext.fillStyle = blackGrad;
    this.canvasContext.fillRect(0, 0, width, height);

    if (this.selectedPosition) {
      this.canvasContext.strokeStyle = 'white';
      this.canvasContext.fillStyle = 'white';
      this.canvasContext.beginPath();
      this.canvasContext.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        10,
        0,
        2 * Math.PI
      );
      this.canvasContext.lineWidth = 5;
      this.canvasContext.stroke();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hue']) {
      this.draw();
      const pos = this.selectedPosition;
      if (pos) {
        this.selectedColor.emit(this.getColorAtPosition(pos.x, pos.y));
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mousedown = false;
  }

  onMouseDown(mouseEvent: MouseEvent) {
    this.mousedown = true;
    this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    this.draw();
    this.selectedColor.emit(this.getColorAtPosition(mouseEvent.offsetX, mouseEvent.offsetY));
  }

  onMouseMove(mouseEvent: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
      this.draw();
      this.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.selectedColor.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number) {
    const IMAGE_DATA = this.canvasContext.getImageData(x, y, 1, 1).data;
    const RGBA_START = 'rgba(';
    const RGBA_ALPHA = ',1)';
    const RGBA_SEPARATOR = ',';
    return RGBA_START + IMAGE_DATA[0] + RGBA_SEPARATOR + IMAGE_DATA[1] + RGBA_SEPARATOR + IMAGE_DATA[2] + RGBA_ALPHA;
  }
}