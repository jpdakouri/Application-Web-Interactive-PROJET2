import * as chai from 'chai';
import * as spies from 'chai-spies';
import { describe } from 'mocha';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { Metadata } from '../../classes/metadata';
import { DatabaseService } from './database.service';

chai.use(spies);

const expect = chai.expect;

describe('DatabaseService', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let mongoUri: string;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();
        mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');
    });

    afterEach(() => {
        client.close();
    });

    it('#start shoud connect to database', async () => {
        const clientSpy = chai.spy.on(MongoClient, 'connect');
        await databaseService.startDB(mongoUri, databaseService.options);
        expect(clientSpy).to.have.been.called.with(mongoUri, databaseService.options);
        // tslint:disable-next-line: no-unused-expression
        expect(databaseService.client.isConnected()).to.be.true;
        expect(databaseService.collection.collectionName).to.equal('Drawings');
        databaseService.client.close();
    });

    it('#start() shoud catch error and log it if connection fails', async () => {
        const clientStub = sinon.stub(MongoClient, 'connect').rejects(new Error());
        const consoleSpy = chai.spy.on(console, 'error');
        await databaseService.startDB(mongoUri, databaseService.options);
        expect(consoleSpy).to.have.been.called.with('DATABASE CONNECTION ERROR');
        clientStub.restore();
    });

    it('insertDrawing() should insert a new Drawing in DB', async () => {
        const newDrawing: Metadata = { _id: new ObjectId().toString(), title: 'test', tags: ['tag1', 'tag2'], width: 100, height: 100 };
        await databaseService.insertDrawing(newDrawing);
        const drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings[0]).to.deep.equals(newDrawing);
    });

    it('deleteDrawing() should be called with correct parameter', async () => {
        const spy = chai.spy.on(databaseService.collection, 'findOneAndDelete');
        const id = new ObjectId().toString();
        const toDelete = { _id: new ObjectId(id) };
        await databaseService.deleteDrawing(id);
        expect(spy).to.have.been.called.with(toDelete);
    });

    it('getDrawingsByTags() should return drawings by tag array if only one tag is specified', async () => {
        const newDrawing1: Metadata = { _id: undefined, title: 'test1', tags: ['tag1.1', 'tag1.2'], width: 100, height: 100 };
        const newDrawing2: Metadata = { _id: undefined, title: 'test2', tags: ['tag2.1', 'tag2.2'], width: 100, height: 100 };
        const newDrawing3: Metadata = { _id: undefined, title: 'test3', tags: ['tag3.1', 'tag3.2'], width: 100, height: 100 };
        const newDrawing4: Metadata = { _id: undefined, title: 'test4', tags: ['tag1.1', 'tag4.2'], width: 100, height: 100 };
        const newDrawing5: Metadata = { _id: undefined, title: 'test5', tags: ['tag5.1', 'tag5.2'], width: 100, height: 100 };
        const newDrawings: Metadata[] = [];
        newDrawings.push(newDrawing1);
        newDrawings.push(newDrawing4);
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        await databaseService.insertDrawing(newDrawing3);
        await databaseService.insertDrawing(newDrawing4);
        await databaseService.insertDrawing(newDrawing5);
        const drawings = await databaseService.getDrawingsByTags(('tag1.1' as unknown) as string[]);
        expect(drawings.length).to.equal(2);
        drawings.forEach((element, index) => {
            expect(element.title).to.equal(newDrawings[index].title);
            expect(element.tags).to.deep.equal(newDrawings[index].tags);
        });
    });

    it('getDrawingsByTags() should return drawings by tags', async () => {
        const newDrawing1: Metadata = { _id: undefined, title: 'test1', tags: ['tag1.1', 'tag1.2'], width: 100, height: 100 };
        const newDrawing2: Metadata = { _id: undefined, title: 'test2', tags: ['tag2.1', 'tag2.2'], width: 100, height: 100 };
        const newDrawing3: Metadata = { _id: undefined, title: 'test3', tags: ['tag3.1', 'tag3.2'], width: 100, height: 100 };
        const newDrawing4: Metadata = { _id: undefined, title: 'test4', tags: ['tag1.1', 'tag4.2'], width: 100, height: 100 };
        const newDrawing5: Metadata = { _id: undefined, title: 'test5', tags: ['tag5.1', 'tag5.2'], width: 100, height: 100 };
        const newDrawings: Metadata[] = [];
        newDrawings.push(newDrawing1);
        newDrawings.push(newDrawing3);
        newDrawings.push(newDrawing4);
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        await databaseService.insertDrawing(newDrawing3);
        await databaseService.insertDrawing(newDrawing4);
        await databaseService.insertDrawing(newDrawing5);
        const drawings = await databaseService.getDrawingsByTags(['tag1.1', 'tag3.2']);
        expect(drawings.length).to.equal(3);
        drawings.forEach((element, index) => {
            expect(element.title).to.equal(newDrawings[index].title);
            expect(element.tags).to.deep.equal(newDrawings[index].tags);
        });
    });

    it('getDrawingsByTags() should return all drawings if tag array is undefined', async () => {
        const newDrawing1: Metadata = { _id: undefined, title: 'test1', tags: ['tag1.1', 'tag1.2'], width: 100, height: 100 };
        const newDrawing2: Metadata = { _id: undefined, title: 'test2', tags: ['tag2.1', 'tag2.2'], width: 100, height: 100 };
        const newDrawing3: Metadata = { _id: undefined, title: 'test3', tags: ['tag3.1', 'tag3.2'], width: 100, height: 100 };
        const newDrawing4: Metadata = { _id: undefined, title: 'test4', tags: ['tag1.1', 'tag4.2'], width: 100, height: 100 };
        const newDrawing5: Metadata = { _id: undefined, title: 'test5', tags: ['tag5.1', 'tag5.2'], width: 100, height: 100 };
        const newDrawings: Metadata[] = [];
        newDrawings.push(newDrawing1);
        newDrawings.push(newDrawing2);
        newDrawings.push(newDrawing3);
        newDrawings.push(newDrawing4);
        newDrawings.push(newDrawing5);
        await databaseService.insertDrawing(newDrawing1);
        await databaseService.insertDrawing(newDrawing2);
        await databaseService.insertDrawing(newDrawing3);
        await databaseService.insertDrawing(newDrawing4);
        await databaseService.insertDrawing(newDrawing5);
        const drawings = await databaseService.getDrawingsByTags((undefined as unknown) as string[]);
        expect(drawings.length).to.equal(5);
        drawings.forEach((element, index) => {
            expect(element.title).to.equal(newDrawings[index].title);
            expect(element.tags).to.deep.equal(newDrawings[index].tags);
        });
    });

    it('updateDrawing() should update the drawing in DB', async () => {
        const spy = chai.spy.on(databaseService.collection, 'findOneAndUpdate');
        const id = new ObjectId().toString();
        const updatedDrawing: Metadata = { _id: id, title: 'test1', tags: ['tag1.1', 'tag1.2'], width: 100, height: 100 };
        const newValues = { $set: { title: updatedDrawing.title, tags: updatedDrawing.tags } };
        const toUpdate = { _id: new ObjectId(id) };
        await databaseService.updateDrawing(updatedDrawing);
        expect(spy).to.have.been.called.with(toUpdate, newValues);
    });

    it('getAllDrawing() should return all the drawings in DB', async () => {
        const newDrawing1: Metadata = { _id: undefined, title: 'test1', tags: ['tag1.1', 'tag1.2'], width: 100, height: 100 };
        const newDrawing2: Metadata = { _id: undefined, title: 'test2', tags: ['tag2.1', 'tag2.2'], width: 100, height: 100 };
        const newDrawing3: Metadata = { _id: undefined, title: 'test3', tags: ['tag3.1', 'tag3.2'], width: 100, height: 100 };
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
