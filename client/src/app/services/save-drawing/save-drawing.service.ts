import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerErrorMessageComponent } from '@app/components/server-error-message/server-error-message.component';
import { HttpService } from '@app/services/http/http.service';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { DrawingData } from '@common/communication/drawing-data';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    currentFormat: BehaviorSubject<string>;
    previewCanvas: HTMLCanvasElement;
    originalCanvas: HTMLCanvasElement;
    id: number;

    canvas: HTMLCanvasElement;
    fileName: string;
    selectedFormat: string;
    formats: string[];
    labelsChecked: string[];

    constructor(private httpService: HttpService, public dialog: MatDialog) {
        this.originalCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.currentFormat = new BehaviorSubject<string>(ImageFormat.PNG);
    }

    private getImageDataFromCanva(): ImageData {
        const emptyImageData = new ImageData(this.canvas.width, this.canvas.height);
        const imageData = this.canvas
            .getContext('2d', {
                alpha: true,
            })
            ?.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return imageData ? imageData : emptyImageData;
    }

    addDrawing(): Observable<unknown> {
        const drawingToSend = new DrawingData(
            undefined,
            this.fileName,
            this.labelsChecked != undefined ? this.labelsChecked : ['none'],
            this.getImageDataFromCanva(),
        );

        return this.httpService.insertDrawing(drawingToSend).pipe(catchError(this.handleError<void>('basicPost')));
    }

    drawPreviewImage(): void {
        const previewContext = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        let dataURL = '';
        if (this.originalCanvas) dataURL = this.originalCanvas.toDataURL(ImageFormat.PNG);

        previewContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

        const image = new Image();
        if (dataURL) {
            image.src = dataURL;
            image.onload = () => {
                // get the scale
                const scale = Math.min(this.previewCanvas.width / image.width, this.previewCanvas.height / image.height);
                // get the top left position of the image
                const x = this.previewCanvas.width / 2 - (image.width / 2) * scale;
                const y = this.previewCanvas.height / 2 - (image.height / 2) * scale;
                previewContext.drawImage(image, x, y, image.width * scale, image.height * scale);
            };
        }
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: HttpErrorResponse): Observable<T> => {
            if (error.status === 0) this.openDialog('Serveur Indisponible');
            else this.openDialog(error.error);
            console.log(error);
            return of(result as T);
        };
    }
    // tslint:disable-next-line:no-any
    openDialog(message: any): void {
        this.dialog.open(ServerErrorMessageComponent, { data: message });
    }
}