import * as chai from 'chai';
import * as spies from 'chai-spies';
import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Metadata } from '../../../../common/communication/metadata';
import { DatabaseService } from './database.service';

chai.use(spies);

const expect = chai.expect;

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let mongoUri: string;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = new MongoMemoryServer();
        mongoUri = await mongoServer.getUri();
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

    it('#start shoud connect to database', async () => {
        databaseService.startDB(mongoUri, databaseService.options);
        // tslint:disable: no-unused-expression
        setTimeout(() => {
            const clientSpy = chai.spy.on(MongoClient, 'connect');
            expect(clientSpy).to.have.been.called.with(mongoUri, databaseService.options);
            expect(databaseService.client.isConnected).to.be.true;
            expect(databaseService.collection.collectionName).to.equal('Drawings');
        }, 500);
    });

    it('#start() shoud catch error and log it if connection fails', async () => {
        databaseService.databaseURI = 'errorCatcher';
        const consoleSpy = chai.spy.on(console, 'error');
        databaseService.startDB(mongoUri, databaseService.options);
        setTimeout(() => {
            expect(consoleSpy).to.have.been.called.with('DATABASE CONNECTION ERROR. EXITING PROCESS');
        }, 500);
    });

    it('insertDrawing() should insert a new Drawing in DB', async () => {
        const newDrawing: Metadata = { _id: 1234, title: 'test', tags: ['tag1', 'tag2'] };
        await databaseService.insertDrawing(newDrawing);
        const drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings[0]).to.deep.equals(newDrawing);
    });
});
