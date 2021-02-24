import { Metadata } from '@common/communication/metadata';
import { injectable } from 'inversify';
import { Collection, InsertOneWriteOpResult, MongoClient, MongoClientOptions } from 'mongodb';
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

    start(): void {
        MongoClient.connect(this.databaseURI, this.options)
            .then((client: MongoClient) => {
                console.log('DATABASE CONNECTED');
                this.client = client;
                this.collection = client.db(this.databaseName).collection(this.collectionName);
            })
            .catch(() => {
                console.error('DATABASE CONNECTION ERROR');
            });
    }

    async insertDrawing(metadata: Metadata): Promise<InsertOneWriteOpResult<Metadata>> {
        return await this.collection.insertOne(metadata);
    }
}
