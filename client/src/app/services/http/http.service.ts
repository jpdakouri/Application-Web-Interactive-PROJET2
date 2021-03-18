import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerErrorMessageComponent } from '@app/components/server-error-message/server-error-message.component';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient, public dialog: MatDialog) {}

    private readonly BASE_URL: string = 'http://localhost:3000';

    getAllDrawings(): Observable<DrawingData[]> {
        return this.http.get<DrawingData[]>(this.BASE_URL + '/api/drawings').pipe(catchError(this.handleError<DrawingData[]>('GetAll')));
    }

    // For later !
    // getDrawingsByTags(): Observable<Metadata[]> {
    //     return this.http.get<Metadata[]>(this.BASE_URL + '/api/drawings');
    // }

    deleteDrawing(drawingID: string): Observable<string> {
        return this.http.delete<string>(this.BASE_URL + `/api/drawings/${drawingID}`).pipe(catchError(this.handleError<string>('Deleted')));
    }
    insertDrawing(newDrawing: DrawingData): Observable<string> {
        return this.http.post<string>(this.BASE_URL + '/api/drawings', newDrawing).pipe(catchError(this.handleError<string>('Post')));
    }

    updateDrawing(updatedDrawing: DrawingData): Observable<string> {
        return this.http
            .put<string>(this.BASE_URL + `/api/drawings/${updatedDrawing.id}`, updatedDrawing)
            .pipe(catchError(this.handleError<string>('Put')));
    }
    getOneDrawing(index: number): Observable<DrawingData> {
        return this.http.get<DrawingData>(this.BASE_URL + `/api/drawings/single/${index}`).pipe(catchError(this.handleError<DrawingData>('GetOne')));
    }

    getDrawingsByTags(tags: string[]): Observable<DrawingData[]> {
        let params = new HttpParams();
        for (const tag of tags) {
            params = params.append('tags', tag);
        }
        return this.http
            .get<DrawingData[]>(this.BASE_URL + '/api/drawings/by-tags', { params })
            .pipe(catchError(this.handleError<DrawingData[]>('GetByTags')));
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
