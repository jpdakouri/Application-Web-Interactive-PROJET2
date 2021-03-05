import { Metadata } from '@common/communication/metadata';
import { injectable } from 'inversify';
import {
    Collection,
    FindAndModifyWriteOpResultObject,
    InsertOneWriteOpResult,
    MongoClient,
    MongoClientOptions,
    ObjectId,
    UpdateWriteOpResult,
} from 'mongodb';
import 'reflect-metadata';
@injectable()
export class DatabaseService {
    collection: Collection<Metadata>;
    client: MongoClient;
    databaseURI: string = 'mongodb+srv://equipe306:bonjour@cluster0.9eqgj.mongodb.net/PolyDessin2?retryWrites=true&w=majority';
    databaseName: string = 'PolyDessin2';
    collectionName: string = 'Drawings';

    options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    startDB(DB_URI: string, options: MongoClientOptions): void {
        MongoClient.connect(DB_URI, options)
            .then((client: MongoClient) => {
                console.log('DATABASE CONNECTED');
                this.client = client;
                this.collection = client.db(this.databaseName).collection(this.collectionName);
            })
            .catch(() => {
                console.error('DATABASE CONNECTION ERROR');
            });
    }

    // TODO TESTS

    async insertDrawing(metadata: Metadata): Promise<InsertOneWriteOpResult<Metadata>> {
        return await this.collection.insertOne(metadata);
    }

    // async getDrawingsByTags(tags: string[]): Promise<Metadata[]> {
    //     if (tags.length > 0) {
    //         return this.collection.find({}).toArray();
    //     } else {
    //         return this.collection.find({ tags: { $in: [tags] } }).toArray();
    //     }
    // }

    async getAllDrawings(): Promise<Metadata[]> {
        return this.collection.find({}).toArray();
    }

    async deleteDrawing(id: string): Promise<FindAndModifyWriteOpResultObject<Metadata>> {
        return await this.collection.findOneAndDelete({ _id: new ObjectId(id) });
    }

    async updateDrawing(drawing: Metadata): Promise<UpdateWriteOpResult> {
        const newValues = { title: drawing.title, tags: drawing.tags };
        return await this.collection.updateOne({ _id: drawing._id }, newValues);
    }
}
