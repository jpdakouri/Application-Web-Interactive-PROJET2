import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpService } from '@app/services/http/http.service';
import { HttpServiceMock } from '@app/utils/tests-mocks/http-service-mock';
import { ImgurApiService } from './imgur-api.service';

describe('ImgurApiService', () => {
    let service: ImgurApiService;
    let httpServiceMock: HttpServiceMock;

    beforeEach(() => {
        httpServiceMock = new HttpServiceMock();
        TestBed.configureTestingModule({
            providers: [{ provide: HttpService, useValue: httpServiceMock }],
            imports: [HttpClientModule],
        });
        service = TestBed.inject(ImgurApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
