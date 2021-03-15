import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { HttpService } from '@app/services/http/http.service';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;
    drawing: DrawingData;

    constructor(private httpService: HttpService) {}

    deleteDrawing(): void {
        if (this.drawing.id) {
            this.httpService.deleteDrawing(this.drawing.id).subscribe({
                next: (result) => {
                    console.log("La requête DELETE s'est bien déroulée !");
                    console.log(result);
                },
                error: (err) => {
                    console.log('Une erreur est survenue lors de la requête DELETE !');
                    console.log(err);
                },
            });
        }
    }

    // updateDrawing(): void {
    //     const labels = this.toStringArray(this.labelsChecked);
    //     const drawingToSend = new DrawingData(
    //         this.drawing.id,
    //         this.fileName,
    //         this.labelsChecked != undefined ? labels : ['none'],
    //         this.getDataURLFromCanvas(),
    //         this.originalCanvas.width,
    //         this.originalCanvas.height,
    //     );
    //     this.httpService.updateDrawing(drawingToSend).subscribe({
    //         next: (result) => {
    //             console.log("La requête PUT s'est bien déroulée !");
    //             console.log(result);
    //             this.drawing = drawingToSend;
    //         },
    //         error: (err) => {
    //             console.log('Une erreur est survenue lors de la requête PUT !');
    //             console.log(err);
    //         },
    //     });
    // }

    getAllDrawings(): void {
        this.httpService.getAllDrawings().subscribe({
            next: (results) => {
                console.log("La requête GET s'est bien déroulée !");
            },
            error: (err) => {
                console.log('une erreur est survenue lors de la requête GET !');
                console.log(err);
            },
        });
    }
}
