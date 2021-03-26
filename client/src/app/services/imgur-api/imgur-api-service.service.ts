import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface PostResponse {
    data: Data;
    status: number;
    success: boolean;
}

interface Data {
    link: string;
}

@Injectable({
    providedIn: 'root',
})
export class ImgurApiServiceService {
    private readonly clientID: string = '44fe94b59de1261';
    private readonly IMGUR_UPLOAD_URL: string = 'https://api.imgur.com/3/image';

    constructor(private http: HttpClient) {}

    upload(fileName: string, imageSource: string): Observable<PostResponse> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Client-ID ${this.clientID}`,
            }),
        };
        const formData = new FormData();
        // const img = this.dataURItoBlob(imageSource);
        formData.append('image', imageSource);
        formData.append('name', fileName);

        // @ts-ignore
        return this.http.post<PostResponse>(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
        // .subscribe((res) => {
        //     console.log(res.data.link);
        // });
    }

    // upload(fileName: string, image: Blob): Observable<any> {
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             Authorization: `Client-ID ${this.clientID}`,
    //         }),
    //     };
    //     const formData = new FormData();
    //     // const img = this.dataURItoBlob(imageSource);
    //     formData.append('image', image, fileName);
    //
    //     return this.http.post(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
    // }

    // dataURItoBlob(dataURI: string): Blob {
    //     // convert base64/URLEncoded data component to raw binary data held in a string
    //     let byteString;
    //     if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
    //     else byteString = unescape(dataURI.split(',')[1]);
    //
    //     // separate out the mime component
    //     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //
    //     // write the bytes of the string to a typed array
    //     const ia = new Uint8Array(byteString.length);
    //     for (let i = 0; i < byteString.length; i++) {
    //         ia[i] = byteString.charCodeAt(i);
    //     }
    //
    //     return new Blob([ia], { type: mimeString });
    // }
}
