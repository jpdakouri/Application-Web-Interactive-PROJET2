export class Metadata {
    constructor(_id: number, title: string, tags: string[]) {
        this._id = _id;
        this.title = title;
        this.tags = tags;
    }
    _id: number;
    title: string;
    tags: string[];
}
