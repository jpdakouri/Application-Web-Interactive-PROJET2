import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrls: ['./drawing-card.component.scss'],
})
export class DrawingCardComponent implements AfterViewInit, OnInit {
    @ViewChild('image') image: ElementRef<HTMLImageElement>;
    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingData;
    @Output() toOpen: EventEmitter<boolean>;
    @Output() toDelete: EventEmitter<boolean>;
    imageSize: CardStyle;

    constructor() {
        this.toOpen = new EventEmitter<boolean>();
        this.toDelete = new EventEmitter<boolean>();
    }
    ngOnInit(): void {
        if (this.infoDrawing.width > this.infoDrawing.height) {
            this.imageSize = {
                width: '90%',
                height: 'auto',
            } as CardStyle;
            // this.image.nativeElement.style.width = '90%';
            // this.image.nativeElement.style.height = 'auto';
        } else {
            this.imageSize = {
                width: 'auto',
                height: '75%',
            } as CardStyle;
            // this.image.nativeElement.style.height = '10%';
            // this.image.nativeElement.style.width = 'auto';
        }
    }
    ngAfterViewInit(): void {}

    open(): void {
        this.toOpen.emit(true);
    }

    deleteDrawing(): void {
        this.toDelete.emit(true);
    }
}
