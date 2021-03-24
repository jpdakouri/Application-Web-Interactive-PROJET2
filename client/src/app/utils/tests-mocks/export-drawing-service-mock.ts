import { ImageFilter } from '@app/utils/enums/image-filter.enum';
import { ImageFormat } from '@app/utils/enums/image-format.enum';
import { BehaviorSubject } from 'rxjs';

export class ExportDrawingServiceMock {
    imageFilters: Map<string, string> = new Map<string, string>([
        [ImageFilter.None, 'none'],
        [ImageFilter.Blur, 'blur(5px)'],
    ]);
    currentFilter: BehaviorSubject<string> = new BehaviorSubject<string>(ImageFilter.None);
    currentFormat: BehaviorSubject<string> = new BehaviorSubject<string>(ImageFormat.PNG);
    imageSource: string = '';
    link: HTMLAnchorElement = document.createElement('a');
    canvas: HTMLCanvasElement;

    // tslint:disable-next-line:no-empty
    downloadDrawingAsImage = (): void => {};
}
