import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hue-selector',
  templateUrl: './hue-selector.component.html',
  styleUrls: ['./hue-selector.component.scss']
})
export class HueSelectorComponent {
  // Code inspiré par https://malcoded.com/posts/angular-color-picker/
  
  private readonly CANVAS_CONTEXT: CanvasRenderingContext2D;
  private readonly RAINBOW_GRADIENT: CanvasGradient;
  private readonly WIDTH: number;
  private readonly HEIGHT: number;
  @ViewChild('sliderCanvas')sliderCanvas: ElementRef<HTMLCanvasElement>;
  
  constructor() {
    const CONTEXT = this.sliderCanvas.nativeElement.getContext('2d');
    if (CONTEXT != null) // Étape nécessaire pour assigner à canvasContext
      this.CANVAS_CONTEXT = CONTEXT; 
    this.WIDTH = this.sliderCanvas.nativeElement.width;
    this.HEIGHT = this.sliderCanvas.nativeElement.width;
    this.RAINBOW_GRADIENT = this.CANVAS_CONTEXT.createLinearGradient(0, 0, 0, this.HEIGHT);
    this.RAINBOW_GRADIENT.addColorStop(0, 'rgba(255, 0, 0, 1)');
    this.RAINBOW_GRADIENT.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    this.RAINBOW_GRADIENT.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    this.RAINBOW_GRADIENT.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    this.RAINBOW_GRADIENT.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    this.RAINBOW_GRADIENT.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    this.RAINBOW_GRADIENT.addColorStop(1, 'rgba(255, 0, 0, 1)');
  }

  draw() {
    this.CANVAS_CONTEXT.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  
    this.CANVAS_CONTEXT.beginPath();
    this.CANVAS_CONTEXT.rect(0, 0, this.WIDTH, this.HEIGHT);
    this.CANVAS_CONTEXT.fillStyle = this.RAINBOW_GRADIENT;
    this.CANVAS_CONTEXT.fill();
    this.CANVAS_CONTEXT.closePath();
  }
}
