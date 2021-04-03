import { Component } from '@angular/core';
import { DialogControllerService } from '@app/services/dialog-controller/dialog-controller.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
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
        this.drawingService.createNewDrawing(true);
    }

    openCarousel(): void {
        this.onCreateNewDrawing();
        this.dialogControllerService.openDialog('carousel');
    }

    onContinueDrawing(): void {
        this.drawingService.continueDrawing();
    }
}
