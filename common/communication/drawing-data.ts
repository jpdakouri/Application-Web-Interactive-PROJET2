export class DrawingData {
    constructor(_id: string, title: string, tags: string[], imageData: ImageData) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
        this.imageData = imageData;
    }
    _id: string;
    title: string;
    tags: string[];
    imageData: ImageData;
}
