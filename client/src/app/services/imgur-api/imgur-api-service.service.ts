import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurApiServiceService {
    private readonly clientID: string = '44fe94b59de1261';
    private readonly IMGUR_UPLOAD_URL: string = 'https://api.imgur.com/3/image';

    constructor(private http: HttpClient) {}

    upload(fileName: string, imageSource: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Client-ID ${this.clientID}`,
            }),
        };
        const formData = new FormData();
        formData.append('image', imageSource);

        return this.http.post(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
    }
}
