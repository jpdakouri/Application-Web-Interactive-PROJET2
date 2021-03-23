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
    initCarousel(tagFlag: boolean): Observable<DrawingData[]> {
        this.drawingsToShow = [];
        const subject = new Subject<DrawingData[]>();

        this.getArraySizeOfDrawing(tagFlag).subscribe((size) => {
            subject.next(this.drawingsToShow);
            if (size > 0) {
                this.httpService.getOneDrawing(-1, tagFlag).subscribe({
                    next: (resultFirst) => {
                        this.drawingsToShow.push(resultFirst);
                        if (this.sizeOfArray > 1) {
                            this.httpService.getOneDrawing(0, tagFlag).subscribe({
                                next: (resultSecond) => {
                                    this.drawingsToShow.push(resultSecond);
                                    this.httpService.getOneDrawing(1, tagFlag).subscribe({
                                        next: (resultThird) => {
                                            this.drawingsToShow.push(resultThird);
                                            subject.next(this.drawingsToShow);
                                        },
                                    });
                                },
                            });
                        } else {
                            subject.next(this.drawingsToShow);
                        }
                    },
                });
            } else {
                subject.next(this.drawingsToShow);
            }
        });
        return subject.asObservable();
    }

    getArraySizeOfDrawing(tagFlag: boolean): Observable<number> {
        const subject = new Subject<number>();
        this.httpService.getLengthOfDrawings(tagFlag).subscribe({
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
    getDrawing(rightSearch: boolean, tagFlag: boolean): Observable<DrawingData> {
        const subject = new Subject<DrawingData>();
        const k: number = rightSearch
            ? ((++this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) + 1
            : ((--this.courrentIndex + this.sizeOfArray) % this.sizeOfArray) - 1;

        this.httpService.getOneDrawing(k, tagFlag).subscribe({
            next: (result) => {
                subject.next(result);
            },
        });
        return subject.asObservable();
    }

    openDrawing(drawing: DrawingData): void {
        this.drawingService.openDrawing(drawing);
    }

    async deleteDrawing(id: string): Promise<string> {
        const promise = new Promise<string>((resolve) => {
            setTimeout(() => {
                this.httpService.deleteDrawing(id).subscribe({
                    next: (result) => {
                        if (result) {
                            resolve('Le dessin a été supprimé');
                        }
                    },
                });
            }, 200);
        });
        return promise;
    }
}
