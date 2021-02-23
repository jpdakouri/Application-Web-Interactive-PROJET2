import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // We use the local Mongo Instance and not the production database
        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');
    });

    afterEach(async () => {
        client.close();
    });
});
