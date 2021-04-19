import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel-components/carousel/carousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HttpService } from '@app/services/http/http.service';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, Subject } from 'rxjs';
const WAIT_ANSWER_TIME = 200;
const LAST_INDEX_OF_ARRAY = -1;

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    carouselDialog: MatDialogRef<CarouselComponent>;
    sizeOfArray: number;
    courrentIndex: number;
    drawingsToShow: DrawingData[];

    constructor(private httpService: HttpService, public drawingService: DrawingService) {
        this.courrentIndex = 0;
    }

    initCarousel(tagFlag: boolean): Observable<DrawingData[]> {
        this.drawingsToShow = [];
        this.courrentIndex = 0;
        return new Observable((subscriber) => {
            this.getArraySizeOfDrawing(tagFlag).subscribe((size) => {
                if (size <= 0) {
                    subscriber.next(this.drawingsToShow);
                    return;
                }
                this.httpService.getOneDrawing(LAST_INDEX_OF_ARRAY, tagFlag).subscribe({
                    next: (resultFirst) => {
                        this.drawingsToShow.push(resultFirst);
                        if (this.sizeOfArray <= 1) {
                            subscriber.next(this.drawingsToShow);
                            return;
                        }
                        this.httpService.getOneDrawing(0, tagFlag).subscribe({
                            next: (resultSecond) => {
                                this.drawingsToShow.push(resultSecond);
                                this.httpService.getOneDrawing(1, tagFlag).subscribe({
                                    next: (resultThird) => {
                                        this.drawingsToShow.push(resultThird);
                                        subscriber.next(this.drawingsToShow);
                                    },
                                });
                            },
                        });
                    },
                });
            });
        });
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
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                this.httpService.deleteDrawing(id).subscribe({
                    next: (result) => {
                        if (result) {
                            resolve('Le dessin a été supprimé');
                        }
                    },
                });
            }, WAIT_ANSWER_TIME);
        });
    }
}
