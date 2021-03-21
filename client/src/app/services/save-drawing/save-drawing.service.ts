import { ElementRef, Injectable } from '@angular/core';
import { HttpService } from '@app/services/http/http.service';
import { Tag } from '@app/utils/interfaces/tag';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    previewCanvas: ElementRef<HTMLImageElement>;
    originalCanvas: HTMLCanvasElement;
    id: number;
    image: ElementRef<HTMLImageElement>;
    fileName: string;

    drawing: DrawingData;
    labelsChecked: Tag[];

    constructor(private httpService: HttpService) {}

    getDataURLFromCanvas(): string {
        const context = this.originalCanvas.getContext('2d');
        const width = this.originalCanvas.width;
        const height = this.originalCanvas.height;
        let dataURL = '';
        if (context) {
            const data = context.getImageData(0, 0, width, height);
            const compositeOperation = context.globalCompositeOperation;
            context.globalCompositeOperation = 'destination-over';
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
            dataURL = this.originalCanvas.toDataURL('image/png');
            context.clearRect(0, 0, width, height);
            context.putImageData(data, 0, 0);
            context.globalCompositeOperation = compositeOperation;
        }

        return dataURL;
    }

    addDrawing(): void {
        const labels = this.toStringArray(this.labelsChecked);
        const drawingToSend = new DrawingData(
            undefined,
            this.fileName,
            this.labelsChecked != undefined ? labels : ['none'],
            this.getDataURLFromCanvas(),
            this.originalCanvas.width,
            this.originalCanvas.height,
        );

        this.httpService.insertDrawing(drawingToSend).subscribe({
            next: (result) => {
                console.log("La requête POST s'est bien déroulée !");
            },
            error: (err) => {
                console.error('Une erreur est survenue dans lors de la requête POST');
                console.error(err);
            },
        });
    }

    toStringArray(labels: Tag[]): string[] {
        const tempArray = new Array<string>();
        let i: number;
        for (i = 0; i < labels.length; i++) tempArray.push(labels[i].name);
        return tempArray;
    }
}
