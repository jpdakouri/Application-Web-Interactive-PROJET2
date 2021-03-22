export class DrawingDataMock {
    id: string | undefined;
    title: string;
    tags: string[];
    dataURL: string | undefined;
    width: number;
    height: number;
    constructor(id: string) {
        // tslint:disable:no-magic-numbers
        (this.id = id), (this.title = 'testDrawing'), (this.tags = ['ugly']), (this.dataURL = 'url'), (this.width = 300), (this.height = 300);
    }
}
