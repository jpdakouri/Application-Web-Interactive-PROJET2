import { Component } from '@angular/core';
import { DialogControllerService } from '@app/services/dialog-controller/dialog-controller.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { DrawingData } from '@common/communication/drawing-data';
import { Message } from '@common/communication/message';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    canOpen: boolean = false;
    isPendingDrawing: boolean = false;
    drawingService: DrawingService;
    constructor(private basicService: IndexService, drawingService: DrawingService, private dialogControllerService: DialogControllerService) {
        this.drawingService = drawingService;
    }

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        this.basicService.basicPost(newTimeMessage).subscribe();
    }

    getMessagesFromServer(): void {
        this.basicService
            .basicGet()
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }

    onCreateNewDrawing(): void {
        this.drawingService.createNewDrawing();
    }

    openCarousel(): void {
        this.onCreateNewDrawing();
        this.dialogControllerService.openDialog('carousel');
    }

    onContinueDrawing(): void {
        if (!this.drawingService.isCanvasBlank() && localStorage.getItem('canvasBuffer')) {
            const dataURL = localStorage.getItem('canvasBuffer');
            const image = new Image();
            image.src = dataURL as string;
            if (dataURL) {
                const drawingData: DrawingData = new DrawingData(
                    '',
                    '',
                    [],
                    dataURL,
                    this.drawingService.canvas.width,
                    this.drawingService.canvas.height,
                );
                this.drawingService.openDrawing(drawingData);
            }
            this.drawingService.restoreCanvas();
        }
    }
}
