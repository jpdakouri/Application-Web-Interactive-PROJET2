import * as chai from 'chai';
import * as spies from 'chai-spies';
import { FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, MongoError, ObjectId } from 'mongodb';
import * as supertest from 'supertest';
import { DrawingData } from '../../../../common/communication/drawing-data';
import { Metadata } from '../../../../common/communication/metadata';
import { Stubbed, testingContainer } from '../../../test/test-utils';
import { Application } from '../../app';
import { DatabaseService } from '../../services/database-service/database.service';
import { TYPES } from '../../types';
import { ImageDataService } from './image-data/image-data.service';
chai.use(spies);
const expect = chai.expect;

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let imageDataService: Stubbed<ImageDataService>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            startDB: sandbox.stub().resolves(),
            insertDrawing: sandbox.stub().resolves(),
            getAllDrawings: sandbox.stub().resolves(),
            deleteDrawing: sandbox.stub().resolves(),
        });
        container.rebind(TYPES.ImageDataService).toConstantValue({
            insertDrawing: sandbox.stub().resolves(),
            filterArray: sandbox.stub().resolves(),
            removeID: sandbox.stub().resolves(),
        });
        imageDataService = container.get(TYPES.ImageDataService);
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('POST request to /drawings should respond a HTTP_STATUS_CREATED status code and insertedId if document inserted', async () => {
        const insertResult = ({ insertedCount: 1, insertedId: '1234' } as unknown) as InsertOneWriteOpResult<Metadata>;
        databaseService.insertDrawing.resolves(insertResult);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body).to.equal(insertResult.insertedId);
            });
    });
    it('POST request to /drawings should call #insertDrawing from ImageDataService with correct parameters', async () => {
        const id = new ObjectId().toString();
        const insertResult = ({ insertedCount: 1, insertedId: id } as unknown) as InsertOneWriteOpResult<Metadata>;
        databaseService.insertDrawing.resolves(insertResult);
        let imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        const spy = chai.spy.on(imageDataService, 'insertDrawing');
        return supertest(app)
            .post('/api/drawings')
            .send(drawingData)
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(drawingData);
            });
    });

    it('POST request to /drawings should respond a HTTP_STATUS_BAD_REQUEST and string message if document not inserted', async () => {
        const insertResult = ({ insertedCount: 0, insertedId: '1234' } as unknown) as InsertOneWriteOpResult<Metadata>;
        databaseService.insertDrawing.resolves(insertResult);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('Document could not be inserted in the database !');
            });
    });

    it('POST request to /drawings should respond a HTTP_STATUS_ERROR and string message if database error', async () => {
        databaseService.insertDrawing.rejects(new MongoError('Test Error'));
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal('Database operation error !');
            });
    });

    it('GET request to /drawings should respond a HTTP_STATUS_OK and an array containing DrawingData', async () => {
        const filterArrayResults: DrawingData[] = [];
        const getResults = new Array(10);
        let imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        for (let i = 0; i < 5; i++) {
            const drawing = new DrawingData(new ObjectId().toString(), `titleStub${i}`, [`tagStub1${i}`, `tagStub2${i}`], imageData);
            filterArrayResults.push(drawing);
        }
        imageDataService.filterArray.returns(filterArrayResults);
        databaseService.getAllDrawings.resolves(getResults);
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(filterArrayResults);
            });
    });

    it('GET request to /drawings should call #filterArray from ImageDataService with correct parameter', async () => {
        const getResults: DrawingData[] = [];
        let imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        for (let i = 0; i < 5; i++) {
            getResults.push(new DrawingData(new ObjectId().toString(), `titleStub${i}`, [`tagStub1${i}`, `tagStub2${i}`], imageData));
        }
        databaseService.getAllDrawings.resolves(getResults);
        const spy = chai.spy.on(imageDataService, 'filterArray');
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(getResults);
            });
    });

    it('GET request to /drawings should should respond a HTTP_STATUS_NOT_FOUND and string message if no drawings are found', async () => {
        const getResults: DrawingData[] = [];
        databaseService.getAllDrawings.resolves(getResults);
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('No drawings found !');
            });
    });

    it('GET request to /drawings should should respond a HTTP_STATUS_ERROR and string message if database error', async () => {
        databaseService.getAllDrawings.rejects();
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal('Database operation error !');
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_OK and correct message', async () => {
        const id = new ObjectId().toString();
        const metadata = new Metadata(id, 'stubTitle', ['stubTag1', 'stubTag2']);
        const deleteResult = ({ ok: 1, value: metadata } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.deleteDrawing.resolves(deleteResult);
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.text).to.equal('"Drawing deleted !"');
            });
    });

    // it('DELETE request to /drawings should respond a HTTP_STATUS_OK and correct message', async () => {
    //     const id = new ObjectId().toString();
    //     const result = { ok: 1, value: new Metadata(id, 'titleStub', ['tagStub1', 'tagStub2']) };
    //     databaseService.getAllDrawings.resolves(result);
    //     return supertest(app)
    //         .get(`/api/drawings/${id}`)
    //         .expect(HTTP_STATUS_OK)
    //         .then((response: any) => {
    //             expect(response.text).to.equal('Drawing deleted !');
    //         });
    // });
});
