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

    deleteDrawing(drawingID: string): Observable<string> {
        return this.http.delete<string>(this.BASE_URL + `/api/drawings/${drawingID}`).pipe(catchError(this.handleError<string>('DeleteDrawing')));
    }

    insertDrawing(newDrawing: DrawingData): Observable<string> {
        return this.http.post<string>(this.BASE_URL + '/api/drawings', newDrawing).pipe(catchError(this.handleError<string>('InsertOneDrawing')));
    }

    getOneDrawing(index: number, tagFlag: boolean): Observable<DrawingData> {
        let params = new HttpParams();
        params = params.append('index', index.toString());
        params = params.append('tagFlag', tagFlag.toString());
        return this.http
            .get<DrawingData>(this.BASE_URL + '/api/drawings/single', { params })
            .pipe(catchError(this.handleError<DrawingData>('GetOneDrawing')));
    }

    getLengthOfDrawings(tagFlag: boolean): Observable<number> {
        return this.http.get<number>(this.BASE_URL + `/api/drawings/length/${tagFlag}`).pipe(catchError(this.handleError<number>('GetLength')));
    }

    sendTags(tags: string[]): Observable<string> {
        return this.http.post<string>(this.BASE_URL + '/api/drawings/tags', tags).pipe(catchError(this.handleError<string>('PostTags')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: HttpErrorResponse): Observable<T> => {
            if (error.status === 0) this.openDialog('Serveur Indisponible');
            else this.openDialog(error.error);
            return of(result as T);
        };
    }

    openDialog(message: string): void {
        this.dialog.open(ServerErrorMessageComponent, { data: message });
    }
}
