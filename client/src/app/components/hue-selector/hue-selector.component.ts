import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hue-selector',
  templateUrl: './hue-selector.component.html',
  styleUrls: ['./hue-selector.component.scss']
})
export class HueSelectorComponent implements OnInit {
  // Code inspiré par https://malcoded.com/posts/angular-color-picker/
  
  private canvasContext: CanvasRenderingContext2D;
  private rainbowGradiant: CanvasGradient;
  private width: number;
  private height: number;
  @ViewChild('sliderCanvas')sliderCanvas: ElementRef<HTMLCanvasElement>;
  
  constructor() { }

  ngOnInit() {
  }

  private initialiseGradient(context: CanvasRenderingContext2D) {
    const RED_STRING = 'rgba(255, 0, 0, 1)';
    const YELLOW_STRING = 'rgba(255, 0, 0, 1)';
    const GREEN_STRING = 'rgba(255, 0, 0, 1)';
    const CYAN_STRING = 'rgba(255, 0, 0, 1)';
    const BLUE_STRING = 'rgba(255, 0, 0, 1)';
    const PURPLE_STRING = 'rgba(255, 0, 0, 1)';

    this.rainbowGradiant.addColorStop(0, RED_STRING);
    this.rainbowGradiant.addColorStop(1/6,  YELLOW_STRING);
    this.rainbowGradiant.addColorStop(2/6, GREEN_STRING);
    this.rainbowGradiant.addColorStop(3/6, CYAN_STRING);
    this.rainbowGradiant.addColorStop(4/6, BLUE_STRING);
    this.rainbowGradiant.addColorStop(5/6,  PURPLE_STRING);
    this.rainbowGradiant.addColorStop(1,  PURPLE_STRING);  
  }

  initialiseAttributes() {
    const CONTEXT = this.sliderCanvas.nativeElement.getContext('2d');
      if (CONTEXT != null) { // Étape nécessaire pour assigner à canvasContext
        this.canvasContext = CONTEXT; 
        this.width = this.sliderCanvas.nativeElement.width;
        this.height = this.sliderCanvas.nativeElement.width;
        this.initialiseGradient(this.canvasContext);
      }
  }

  draw() {
    if (this.canvasContext == undefined) {
      this.initialiseAttributes();
    }
    this.canvasContext.clearRect(0, 0, this.width, this.height);
    this.canvasContext.beginPath();
    this.canvasContext.rect(0, 0, this.width, this.height);
    this.canvasContext.fillStyle = this.rainbowGradiant;
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }
}
