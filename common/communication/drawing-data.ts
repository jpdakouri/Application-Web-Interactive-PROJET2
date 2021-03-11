export class DrawingData {
    constructor(id: string | undefined, title: string, tags: string[], imageData: ImageData) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.imageData = imageData;
    }
    id: string | undefined;
    title: string;
    tags: string[];
    imageData: ImageData;
}
