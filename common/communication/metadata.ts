import { ObjectID } from 'mongodb';

export class Metadata {
    constructor(_id: ObjectID | undefined, title: string, tags: string[]) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
    }
    _id: ObjectID | undefined;
    title: string;
    tags: string[];
}
