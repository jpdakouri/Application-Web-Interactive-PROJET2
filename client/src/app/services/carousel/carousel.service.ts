import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HttpService } from '@app/services/http/http.service';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;
    sizeOfArray: number;
    courrentIndex: number = 0;
    drawingsToShow: DrawingData[];

    constructor(private httpService: HttpService, public drawingService: DrawingService) {}

    // tslint:disable:no-magic-numbers
    initCarousel(): Observable<DrawingData[]> {
        this.drawingsToShow = [];
        const subject = new Subject<DrawingData[]>();

        this.getArraySizeOfDrawing().subscribe({
            next: (size) => {
                if (size > 0) {
                    this.httpService.getOneDrawing(-1).subscribe({
                        next: (resultFirst) => {
                            this.drawingsToShow.push(resultFirst);
                            if (this.sizeOfArray > 1) {
                                this.httpService.getOneDrawing(0).subscribe({
                                    next: (resultSecond) => {
                                        this.drawingsToShow.push(resultSecond);
                                        this.httpService.getOneDrawing(1).subscribe({
                                            next: (resultThird) => {
                                                this.drawingsToShow.push(resultThird);
                                                subject.next(this.drawingsToShow);
                                                console.log(this.drawingsToShow.length);
                                            },
                                        });
                                    },
                                });
                            } else {
                                subject.next(this.drawingsToShow);
                                console.log(this.drawingsToShow.length);
                            }
                        },
                    });
                } else {
                    subject.next(this.drawingsToShow);
                    console.log(this.drawingsToShow.length);
                }
            },
            error: () => {
                console.log(this.drawingsToShow.length);
            },
        });
        return subject.asObservable();
    }

    getArraySizeOfDrawing(): Observable<number> {
        const subject = new Subject<number>();
        this.httpService.getLengthOfDrawings().subscribe({
            next: (results) => {
                this.sizeOfArray = results as number;
                subject.next(this.sizeOfArray);
            },
        });
        return subject.asObservable();
    }

    /**
     * @param rightSearch if false, searches left, if true searches right
     * @returns The next drawing in that direction.
     */
    getDrawing(rightSearch: boolean): Observable<DrawingData> {
        const subject = new Subject<DrawingData>();
        const k: number = rightSearch
            ? ((++this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) + 1
            : ((--this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) - 1;
        console.log(k, ' : ', this.courrentIndex);
        this.httpService.getOneDrawing(k).subscribe({
            next: (result) => {
                console.log("La requête GET s'est bien déroulée !");
                subject.next(result);
            },
        });
        return subject.asObservable();
    }

    openDrawing(drawing: DrawingData): void {
        this.drawingService.openDrawing(drawing);
        console.log(drawing.width, drawing.height);
    }

    async deleteDrawing(id: string): Promise<string> {
        const promise = new Promise<string>((resolve) => {
            this.httpService.deleteDrawing(id).subscribe({
                next: (result) => {
                    setTimeout(() => {
                        if (result) {
                            resolve('Le dessin a ne fait plus parti ');
                        }
                    }, 200);
                },
                error: (err) => {
                    console.log('Une erreur est survenue lors de la requête DELETE !');
                    console.log(err);
                },
            });
        });
        return promise;
    }
}
