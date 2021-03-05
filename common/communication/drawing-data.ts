import { ObjectId } from 'mongodb';

export class DrawingData {
    constructor(_id: ObjectId | undefined, title: string, tags: string[], imageData: ImageData) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
        this.imageData = imageData;
    }
    _id: ObjectId | undefined;
    title: string;
    tags: string[];
    imageData: ImageData;
}
