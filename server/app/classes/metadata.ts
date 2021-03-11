import { ObjectId } from 'mongodb';
export class Metadata {
    // tslint:disable: variable-name
    constructor(_id: string | undefined | ObjectId, title: string, tags: string[]) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
    }
    _id: string | undefined | ObjectId;
    title: string;
    tags: string[];
}
