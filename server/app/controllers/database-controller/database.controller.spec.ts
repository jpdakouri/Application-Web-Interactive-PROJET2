import * as chai from 'chai';
import * as spies from 'chai-spies';
import { FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, MongoError, ObjectId } from 'mongodb';
import * as supertest from 'supertest';
import { DrawingData } from '../../../../common/communication/drawing-data';
import { Stubbed, testingContainer } from '../../../test/test-utils';
import { Application } from '../../app';
import { Metadata } from '../../classes/metadata';
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
            updateDrawing: sandbox.stub().resolves(),
        });
        container.rebind(TYPES.ImageDataService).toConstantValue({
            insertDrawing: sandbox.stub().resolves(),
            filterArray: sandbox.stub().resolves(),
            removeID: sandbox.stub().resolves(),
            updateDrawing: sandbox.stub().resolves(),
        });
        imageDataService = container.get(TYPES.ImageDataService);
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('POST request to /drawings should respond a HTTP_STATUS_CREATED status code and insertedId if document inserted', async () => {
        const insertResult = ({ insertedCount: 1, insertedId: '1234' } as unknown) as InsertOneWriteOpResult<Metadata>;
        databaseService.insertDrawing.resolves(insertResult);
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => true);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => true);
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
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        const spy = chai.spy.on(imageDataService, 'insertDrawing');
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => true);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => true);
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
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => true);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => true);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal("Le document n'a pas pu etre inséséré dans la base de données !");
            });
    });

    it('POST request to /drawings should respond a HTTP_STATUS_BAD_REQUEST if name is not valide', async () => {
        databaseService.insertDrawing.rejects(new MongoError('Test Error'));
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => false);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => true);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('Message du serveur: Nom Invalide !');
            });
    });

    it('POST request to /drawings should respond a HTTP_STATUS_BAD_REQUEST if tags are not valide', async () => {
        databaseService.insertDrawing.rejects(new MongoError('Test Error'));
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => true);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => false);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('Message du serveur: Étiquette Invalide!');
            });
    });

    it('POST request to /drawings should respond a HTTP_STATUS_ERROR and string message if database error', async () => {
        databaseService.insertDrawing.rejects(new MongoError('Test Error'));
        chai.spy.on(imageDataService, 'insertNameCheckUp', () => true);
        chai.spy.on(imageDataService, 'insertTagsCheckUp', () => true);
        return supertest(app)
            .post('/api/drawings')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal("Erreur d'opération dans le serveur!");
            });
    });

    it('GET request to /drawings should respond a HTTP_STATUS_OK and an array containing DrawingData', async () => {
        const filterArrayResults: DrawingData[] = [];
        const getResults = new Array(10);
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
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
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
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

    it('GET request to /drawings should respond a HTTP_STATUS_NOT_FOUND and string message if no drawings are found', async () => {
        const getResults: DrawingData[] = [];
        databaseService.getAllDrawings.resolves(getResults);
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('Pas de dessin trouvé!');
            });
    });

    it('GET request to /drawings should respond a HTTP_STATUS_ERROR and string message if database error', async () => {
        databaseService.getAllDrawings.rejects();
        return supertest(app)
            .get('/api/drawings')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal("Erreur d'opération dans le serveur!");
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

    it('DELETE request to /drawings should respond a HTTP_STATUS_NOT_FOUND and correct message', async () => {
        const id = new ObjectId().toString();
        const deleteResult = ({ ok: 0, value: null } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.deleteDrawing.resolves(deleteResult);
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('Drawing not found !');
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_NOT_ERROR and correct message if server or database error', async () => {
        const id = new ObjectId().toString();
        databaseService.deleteDrawing.rejects();
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal('Database operation error !');
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_BAD_REQUEST and correct message if invalid ID', async () => {
        const id = 'invalidID';
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('Invalid ID !');
            });
    });

    it('DELETE request to /drawings should call #removeID from imageDataService with correct parameter', async () => {
        const id = new ObjectId().toString();
        const metadata = new Metadata(id, 'stubTitle', ['stubTag1', 'stubTag2']);
        const deleteResult = ({ ok: 1, value: metadata } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.deleteDrawing.resolves(deleteResult);
        const spy = chai.spy.on(imageDataService, 'removeID');
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(id);
            });
    });
    it('PUT request to /drawings should respond a HTTP_STATUS_OK and correct message if drawing is updated', async () => {
        const id = new ObjectId().toString();
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        const metadata = new Metadata(id, drawingData.title, drawingData.tags);
        const updateResult = ({ ok: 1, value: metadata } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.updateDrawing.resolves(updateResult);
        const spy = chai.spy.on(databaseService, 'updateDrawing');
        return supertest(app)
            .put(`/api/drawings/${id}`)
            .send(drawingData)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.text).to.equal('"Drawing updated !"');
                expect(spy).to.have.been.called.with(metadata);
            });
    });

    it('PUT request to /drawings should respond a HTTP_STATUS_NOT_FOUND and correct message if drawing not found', async () => {
        const id = new ObjectId().toString();
        const updateResult = ({ ok: 0, value: null } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.updateDrawing.resolves(updateResult);
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        return supertest(app)
            .put(`/api/drawings/${id}`)
            .send(drawingData)
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('Drawing not found !');
            });
    });

    it('PUT request to /drawings should respond a HTTP_STATUS_ERROR and correct message if server or database error', async () => {
        const id = new ObjectId().toString();
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        databaseService.updateDrawing.rejects();
        return supertest(app)
            .put(`/api/drawings/${id}`)
            .send(drawingData)
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal('Database operation error !');
            });
    });

    it('PUT request to /drawings should respond a HTTP_STATUS_BAD_REQUEST and correct message if invalid ID', async () => {
        const id = 'invalidID';
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        return supertest(app)
            .put(`/api/drawings/${id}`)
            .send(drawingData)
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('Invalid ID !');
            });
    });

    it('PUT request to /drawings should call #updateDrawing from imageDataService with correct parameter', async () => {
        const id = new ObjectId().toString();
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], imageData);
        const metadata = new Metadata(id, drawingData.title, drawingData.tags);
        const updateResult = ({ ok: 1, value: metadata } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.updateDrawing.resolves(updateResult);
        const spy = chai.spy.on(imageDataService, 'updateDrawing');
        return supertest(app)
            .put(`/api/drawings/${id}`)
            .send(drawingData)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(drawingData);
            });
    });
});
