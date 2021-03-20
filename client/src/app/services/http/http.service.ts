import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerErrorMessageComponent } from '@app/components/server-error-message/server-error-message.component';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// const HTTP_STATUS_ERROR = 500;
// const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_NO_SERVER = 0;
@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient, public dialog: MatDialog) {}

    private readonly BASE_URL: string = 'http://localhost:3000';

    // For later !
    // getDrawingsByTags(): Observable<Metadata[]> {
    //     return this.http.get<Metadata[]>(this.BASE_URL + '/api/drawings');
    // }

    deleteDrawing(drawingID: string): Observable<string> {
        return this.http.delete<string>(this.BASE_URL + `/api/drawings/${drawingID}`).pipe(catchError(this.handleError<string>('Delete')));
    }

    insertDrawing(newDrawing: DrawingData): Observable<string> {
        return this.http.post<string>(this.BASE_URL + '/api/drawings', newDrawing).pipe(catchError(this.handleError<string>('Post')));
    }

    getOneDrawing(index: number): Observable<DrawingData> {
        return this.http.get<DrawingData>(this.BASE_URL + `/api/drawings/single/${index}`).pipe(catchError(this.handleError<DrawingData>('GetOne')));
    }

    getLengthOfDrawings(): Observable<number> {
        return this.http.get<number>(this.BASE_URL + '/api/drawings/length').pipe(catchError(this.handleError<number>('GetLength')));
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
            if (error.status === HTTP_STATUS_NO_SERVER) this.openErrorDialog('Serveur Indisponible');
            else if (error.status === HTTP_STATUS_NOT_FOUND) {
                if (request === 'Delete') this.openErrorDialog('Impossible de supprimer le dessin, il ne fait plus parti de la base de données');
                else if (request === 'GetOne') this.openErrorDialog("Impossible d'ouvrir le dessin, il ne fait plus parti de la base de données");
            } else this.openErrorDialog(error.error);
            return of(result as T);
        };
    }

    openErrorDialog(message: string): void {
        this.dialog.open(ServerErrorMessageComponent, { data: message });
    }
}
