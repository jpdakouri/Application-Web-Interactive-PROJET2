export class Metadata {
    constructor(_id: string, title: string, tags: string[]) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
    }
    _id: string;
    title: string;
    tags: string[];
}
