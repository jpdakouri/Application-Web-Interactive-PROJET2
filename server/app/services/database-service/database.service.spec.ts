import * as chai from 'chai';
import * as spies from 'chai-spies';
import { describe } from 'mocha';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
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
        const clientStub = sinon.stub(MongoClient, 'connect').rejects(new Error());
        databaseService.startDB(mongoUri, databaseService.options);
        const consoleSpy = chai.spy.on(console, 'error');
        setTimeout(() => {
            expect(consoleSpy).to.have.been.called.with('DATABASE CONNECTION ERROR');
        }, 500);
        clientStub.restore();
    });

    it('insertDrawing() should insert a new Drawing in DB', async () => {
        const newDrawing: Metadata = { _id: new ObjectId().toString(), title: 'test', tags: ['tag1', 'tag2'] };
        await databaseService.insertDrawing(newDrawing);
        const drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings[0]).to.deep.equals(newDrawing);
    });

    it('deleteDrawing() should delete the drawing in DB', async () => {
        const id1 = new ObjectId().toString();
        const id2 = new ObjectId().toString();
        const newDrawing1: Metadata = { _id: id1, title: 'test1', tags: ['tag1.1', 'tag1.2'] };
        const newDrawing2: Metadata = { _id: id2, title: 'test2', tags: ['tag2.1', 'tag2.2'] };
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        databaseService.deleteDrawing(id2).then(async () => {
            const drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
            expect(drawings[0]).to.deep.equals(newDrawing1);
        });
    });

    it('updateDrawing() should update the drawing in DB', async () => {
        const id1 = new ObjectId().toString();
        const id2 = new ObjectId().toString();
        const newDrawing1: Metadata = { _id: id1, title: 'test1', tags: ['tag1.1', 'tag1.2'] };
        const newDrawing2: Metadata = { _id: id2, title: 'test2', tags: ['tag2.1', 'tag2.2'] };
        const updatedDrawing2: Metadata = { _id: id2, title: 'updatedTest2', tags: ['updatedTag2.1', 'updatedTag2.2'] };
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        databaseService.updateDrawing(updatedDrawing2).then(async () => {
            const drawings = await databaseService.collection.find({ _id: id2 }).toArray();
            expect(drawings.length).to.equal(1);
            expect(drawings[0]).to.deep.equals(updatedDrawing2);
        });
    });

    it('getAllDrawing() should return all the drawings in DB', async () => {
        const newDrawing1: Metadata = { _id: undefined, title: 'test1', tags: ['tag1.1', 'tag1.2'] };
        const newDrawing2: Metadata = { _id: undefined, title: 'test2', tags: ['tag2.1', 'tag2.2'] };
        const newDrawing3: Metadata = { _id: undefined, title: 'test3', tags: ['tag3.1', 'tag3.2'] };
        const newDrawings: Metadata[] = [];
        newDrawings.push(newDrawing1);
        newDrawings.push(newDrawing2);
        newDrawings.push(newDrawing3);
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        await databaseService.insertDrawing(newDrawing3);
        const drawings = await databaseService.getAllDrawings();
        expect(drawings.length).to.equal(3);
        drawings.forEach((element, index) => {
            expect(element.title).to.equal(newDrawings[index].title);
            expect(element.tags).to.deep.equal(newDrawings[index].tags);
        });
    });
});
