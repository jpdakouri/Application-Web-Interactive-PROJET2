const WIDTH = 300;
const HEIGHT = 300;
export class DrawingDataMock {
    id: string | undefined;
    title: string;
    tags: string[];
    dataURL: string | undefined;
    width: number;
    height: number;
    constructor(id: string) {
        (this.id = id), (this.title = 'testDrawing'), (this.tags = ['ugly']), (this.dataURL = 'url'), (this.width = WIDTH), (this.height = HEIGHT);
    }
}
