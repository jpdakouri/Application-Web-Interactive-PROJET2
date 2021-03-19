import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardStyle } from '@app/utils/interfaces/card-style';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrls: ['./drawing-card.component.scss'],
})
export class DrawingCardComponent implements OnInit {
    @ViewChild('cardcontainer') cardcontainer: HTMLElement;

    @Input() positionCaracteristics: CardStyle;
    @Input() infoDrawing: DrawingData;
    @Output() toOpen: EventEmitter<boolean>;
    @Output() toDelete: EventEmitter<boolean>;
    imageSize: CardStyle;

    constructor(public snackBar: MatSnackBar) {
        this.toOpen = new EventEmitter<boolean>();
        this.toDelete = new EventEmitter<boolean>();
    }
    ngOnInit(): void {
        this.adjustSizeOfImage();
    }

    open(): void {
        this.toOpen.emit(true);
    }

    deleteDrawing(): void {
        this.toDelete.emit(true);
        this.snackBar.open('Dessin supprimé', 'Fermer', {
            duration: 2000,
        });
    }

    set drawingData(dd: DrawingData) {
        this.infoDrawing = dd;
        console.log(this.infoDrawing.height, dd.height);
        this.adjustSizeOfImage();
    }

    adjustSizeOfImage(): void {
        console.log(this.infoDrawing.title + ': ', this.infoDrawing.width, this.infoDrawing.height);
        if (this.infoDrawing.width > this.infoDrawing.height) {
            this.imageSize = {
                width: '90%',
                height: 'auto',
            } as CardStyle;
            console.log('wi');
        }
        if (this.infoDrawing.width <= this.infoDrawing.height) {
            this.imageSize = {
                width: 'auto',
                height: '75%',
            } as CardStyle;
            console.log('he');
        }
    }
}
