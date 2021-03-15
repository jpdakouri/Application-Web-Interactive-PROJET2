import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

    // TODO HTTP ERROR HANDLING
    // TODO GET DRAWINGS BY TAGS
    getAllDrawings(): Observable<DrawingData[]> {
        return this.http.get<DrawingData[]>(this.BASE_URL + '/api/drawings').pipe(catchError(this.handleError<DrawingData[]>('Get')));
    }
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
