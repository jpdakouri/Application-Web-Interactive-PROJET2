import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerErrorMessageComponent } from '@app/components/server-error-message/server-error-message.component';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_NO_SERVER = 0;
@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient, private dialog: MatDialog) {}

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
            if (error.status === HTTP_STATUS_NO_SERVER) this.openErrorDialog('Serveur Indisponible');
            else if (error.status === HTTP_STATUS_NOT_FOUND) {
                if (request === 'DeleteDrawing')
                    this.openErrorDialog('Impossible de supprimer le dessin, il ne fait plus parti de la base de données');
                else if (request === 'GetOneDrawing')
                    this.openErrorDialog("Impossible d'ouvrir le dessin, il ne fait plus parti de la base de données");
            } else this.openErrorDialog(error.error);
            return of(result as T);
        };
    }

    openErrorDialog(message: string): void {
        this.dialog.open(ServerErrorMessageComponent, { data: message });
    }
}
