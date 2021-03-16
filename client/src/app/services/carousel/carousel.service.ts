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
    sizeOfArray: number;
    courrentIndex: number = 0;
    drawingsToShow: DrawingData[];

    constructor(private httpService: HttpService) {}

    initCarousel(): DrawingData[] {
        // 3 requete
        // update#1 du size
        this.drawingsToShow = [] as DrawingData[];
        this.getArraySizeOfDrawing();
        if (this.sizeOfArray > 0)
            this.httpService.getOneDrawing(0).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });
        if (this.sizeOfArray > 1) {
            this.httpService.getOneDrawing(1).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });

            this.httpService.getOneDrawing(-1).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });
        }

        return this.drawingsToShow;
    }

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

    //// Comparer si le serveur a recu des nouveau dessins ou non
    getArraySizeOfDrawing(): void {
        this.httpService.getLengthOfDrawings().subscribe({
            next: (results) => {
                this.sizeOfArray = results as number;
                console.log("La requête GET s'est bien déroulée !");
            },
        });
    }

    /**
     * @param rightSearch if false, searches left, if true searches right
     * @returns The next drawing in that direction.
     */
    getDrawing(rightSearch: boolean): DrawingData {
        this.drawingsToShow = [] as DrawingData[];
        this.httpService.getOneDrawing(rightSearch ? ++this.courrentIndex + 1 : --this.courrentIndex - 1).subscribe({
            next: (result) => {
                console.log("La requête GET s'est bien déroulée 111!");
                this.drawingsToShow.push(result);
            },
        });
        return this.drawingsToShow[0];
    }

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
}
