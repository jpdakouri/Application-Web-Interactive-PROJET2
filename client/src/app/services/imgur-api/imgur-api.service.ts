import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingData } from '@app/utils/interfaces/drawing-data';
import { Observable } from 'rxjs';

// Inspired from https://stackblitz.com/edit/imgur-api-eg?file=src%2Fapp%2Fimgur-api.service.ts

@Injectable({
    providedIn: 'root',
})
export class ImgurApiService {
    private readonly clientID: string = '44fe94b59de1261';
    private readonly IMGUR_UPLOAD_URL: string = 'https://api.imgur.com/3/image';

    constructor(private httpClient: HttpClient) {}

    upload(fileName: string, imageSource: string): Observable<DrawingData> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Client-ID ${this.clientID}`,
            }),
        };
        const formData = new FormData();
        formData.append('image', imageSource);
        formData.append('name', fileName);

        return this.httpClient.post<DrawingData>(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
    }
}
