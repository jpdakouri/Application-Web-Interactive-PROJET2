import { Metadata } from '@common/communication/metadata.ts';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URI = 'mongodb+srv://equipe306:bonjour@cluster0.9eqgj.mongodb.net/PolyDessin2?retryWrites=true&w=majority';
const DATABASE_NAME = 'PolyDessin2';
const DATABASE_COLLECTION = 'Drawings';

@injectable()
export class DatabaseService {
    collection: Collection<Metadata>;
    client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    start(): void {
        MongoClient.connect(DATABASE_URI, this.options)
            .then((client: MongoClient) => {
                this.client = client;
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    closeConnection(): void {
        this.client.close();
    }
}
