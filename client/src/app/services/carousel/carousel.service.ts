import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HttpService } from '@app/services/http/http.service';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;
    sizeOfArray: number;
    courrentIndex: number = 0;
    drawingsToShow: DrawingData[];

    constructor(private httpService: HttpService, public drawingService: DrawingService) {}

    async initCarousel(): Promise<DrawingData[]> {
        this.drawingsToShow = [];
        this.getArraySizeOfDrawing();
        if (this.sizeOfArray > 0)
            this.httpService.getOneDrawing(-1).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });
        if (this.sizeOfArray > 1) {
            this.httpService.getOneDrawing(0).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });

            this.httpService.getOneDrawing(1).subscribe({
                next: (result) => {
                    this.drawingsToShow.push(result);
                },
            });
        }
        console.log(this.drawingsToShow);
        return await this.drawingsToShow;
    }

    deleteDrawing(id: string): void {
        if (id) {
            this.httpService.deleteDrawing(id).subscribe({
                next: (result) => {
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
                console.log(results);
            },
        });
    }

    /**
     * @param rightSearch if false, searches left, if true searches right
     * @returns The next drawing in that direction.
     */
    getDrawing(rightSearch: boolean): DrawingData {
        let drawing: DrawingData = {} as DrawingData;
        this.httpService
            .getOneDrawing(
                rightSearch
                    ? ((++this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) + 1
                    : ((--this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) - 1,
            )
            .subscribe({
                next: (result) => {
                    console.log("La requête GET s'est bien déroulée 111!");
                    drawing = result;
                },
            });
        return drawing;
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

    openDrawing(drawing: DrawingData): void {
        this.drawingService.openDrawing(drawing);
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
