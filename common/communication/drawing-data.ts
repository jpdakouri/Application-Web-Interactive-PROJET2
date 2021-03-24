export class DrawingData {
    constructor(id: string | undefined, title: string, tags: string[], dataURL: string | undefined, width: number, height: number) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.dataURL = dataURL;
        this.width = width;
        this.height = height;
    }
    id: string | undefined;
    title: string;
    tags: string[];
    dataURL: string | undefined;
    width: number;
    height: number;
}
