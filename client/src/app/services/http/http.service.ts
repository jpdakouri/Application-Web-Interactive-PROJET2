import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    private readonly BASE_URL: string = 'http://localhost:3000';

    // TODO HTTP ERROR HANDLING
    // TODO GET DRAWINGS BY TAGS
    // TEST
    getAllDrawings(): Observable<DrawingData[]> {
        return this.http.get<DrawingData[]>(this.BASE_URL + '/api/drawings');
    }
    // getDrawingsByTags(): Observable<Metadata[]> {
    //     return this.http.get<Metadata[]>(this.BASE_URL + '/api/drawings');
    // }
    deleteDrawing(drawingID: string): Observable<string> {
        return this.http.delete<string>(this.BASE_URL + `/api/drawings/${drawingID}`);
    }
    insertDrawing(newDrawing: DrawingData): Observable<string> {
        return this.http.post<string>(this.BASE_URL + '/api/drawings', newDrawing);
    }

    updateDrawing(updatedDrawing: DrawingData): Observable<void> {
        return this.http.put<void>(this.BASE_URL + `/api/drawings/${updatedDrawing._id}`, updatedDrawing);
    }
}
