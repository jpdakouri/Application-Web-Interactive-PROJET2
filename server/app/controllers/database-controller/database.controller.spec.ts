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
            getDrawingsByTags: sandbox.stub().resolves(),
        });
        container.rebind(TYPES.ImageDataService).toConstantValue({
            removeID: sandbox.stub().resolves(),
            updateDrawing: sandbox.stub().resolves(),
            writeDrawingToDisk: sandbox.stub().resolves(),
            getOneImageFromDisk: sandbox.stub().returns(undefined),
            populateArray: sandbox.stub().resolves(),
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
    it('POST request to /drawings should call #writeDrawingToDisk from ImageDataService with correct parameter', async () => {
        const id = new ObjectId().toString();
        const insertResult = ({ insertedCount: 1, insertedId: id } as unknown) as InsertOneWriteOpResult<Metadata>;
        databaseService.insertDrawing.resolves(insertResult);
        const dataURL = 'dataURLStub';
        const drawingData = new DrawingData(id, 'titleStub', ['tagStub1', 'tagStub2'], dataURL, 100, 100);
        const spy = chai.spy.on(imageDataService, 'writeDrawingToDisk');
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
                expect(response.text).to.equal("Le document n'a pas pu être inséré dans la base de données !");
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
                expect(response.text).to.equal('Message du serveur: Étiquette Invalide !');
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
                expect(response.text).to.equal("Erreur d'opération dans le serveur !");
            });
    });

    it('GET request to /drawings/single should respond a HTTP_STATUS_OK and a DrawingData', async () => {
        const dataURL = 'dataURLStub';
        const drawing = new DrawingData('id', 'title', ['tag1', 'tag2'], dataURL, 100, 100);
        imageDataService.getOneImageFromDisk.returns(drawing);
        return supertest(app)
            .get('/api/drawings/single')
            .query({ tagFlag: 'false', index: '0' })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(drawing);
            });
    });

    it('GET request to /drawings/single should respond a HTTP_STATUS_NOT_FOUND and corresponding message if no drawing found', async () => {
        imageDataService.getOneImageFromDisk.returns(undefined);
        return supertest(app)
            .get('/api/drawings/single')
            .query({ tagFlag: 'false', index: '0' })
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.deep.equal('Aucun dessin trouvé !');
            });
    });

    it('GET request to /drawings/single should call #getOneImageFromDisk from imageDataService with correct parameter ', async () => {
        const dataURL = 'dataURLStub';
        const drawing = new DrawingData('id', 'title', ['tag1', 'tag2'], dataURL, 100, 100);
        imageDataService.getOneImageFromDisk.returns(drawing);
        const spy = chai.spy.on(imageDataService, 'getOneImageFromDisk');
        return supertest(app)
            .get('/api/drawings/single')
            .query({ tagFlag: 'false', index: '0' })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(0);
            });
    });

    it('POST request to /drawings/tags should respond HTTP_STATUS_OK and drawing array ', async () => {
        const drawingDatas: DrawingData[] = [];
        const metadatas: Metadata[] = [];
        const uri = 'uriStub';
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], uri, 100, 100);
            const metadata = new Metadata(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], 100, 100);
            metadatas.push(metadata);
            drawingDatas.push(drawingData);
        }
        databaseService.getDrawingsByTags.resolves(metadatas);
        const spy = chai.spy.on(imageDataService, 'populateArray');
        return supertest(app)
            .post('/api/drawings/tags')
            .send(['tag1', 'tag2'])
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(spy).to.have.been.called();
            });
    });
    it('POST request to /drawings/tags should respond HTTP_STATUS_NOT_FOUND and message if no drawings are found in database ', async () => {
        databaseService.getDrawingsByTags.resolves([]);
        return supertest(app)
            .post('/api/drawings/tags')
            .send(['tag1', 'tag2'])
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('"Aucun dessin trouvé !"');
            });
    });

    it('POST request to /drawings/tags should respond a HTTP_STATUS_ERROR and message if error in database', async () => {
        databaseService.getDrawingsByTags.rejects(new MongoError('Test error !'));
        return supertest(app)
            .post('/api/drawings/tags')
            .send(['tag1', 'tag2'])

            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal("Erreur d'opération dans le serveur !");
            });
    });

    it('POST request to /drawings/tags should call getDrawingsByTags from databaseService with correct parameter', async () => {
        databaseService.getDrawingsByTags.resolves([]);
        const spy = chai.spy.on(databaseService, 'getDrawingsByTags');
        return supertest(app)
            .post('/api/drawings/tags')
            .send(['testTag1', 'testTag2'])
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(spy).to.have.been.called.with(['testTag1', 'testTag2']);
            });
    });

    it('POST request to /drawings/tags should respond a HTTP_STATUS_ERROR and string message if server error', async () => {
        const databaseResults: Metadata[] = [];
        const serverResponse: DrawingData[] = [];
        const uri = 'uriStub';
        for (let i = 0; i < 0; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], uri, 100, 100);
            const metadata = new Metadata(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], 100, 100);
            databaseResults.push(metadata);
            serverResponse.push(drawingData);
        }
        databaseService.getDrawingsByTags.rejects();
        return supertest(app)
            .post('/api/drawings/tags')
            .send(['tag1', 'tag2'])

            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal("Erreur d'opération dans le serveur !");
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_OK and correct message', async () => {
        const id = new ObjectId().toString();
        const metadata = new Metadata(id, 'stubTitle', ['stubTag1', 'stubTag2'], 100, 100);
        const deleteResult = ({ ok: 1, value: metadata } as unknown) as FindAndModifyWriteOpResultObject<Metadata>;
        databaseService.deleteDrawing.resolves(deleteResult);
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.text).to.equal('"Dessin supprimé !"');
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
                expect(response.text).to.equal('Aucun dessin trouvé !');
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_NOT_ERROR and correct message if server or database error', async () => {
        const id = new ObjectId().toString();
        databaseService.deleteDrawing.rejects();
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.equal("Erreur d'opération dans le serveur !");
            });
    });

    it('DELETE request to /drawings should respond a HTTP_STATUS_BAD_REQUEST and correct message if invalid ID', async () => {
        const id = 'invalidID';
        return supertest(app)
            .delete(`/api/drawings/${id}`)
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.equal('ID invalide !');
            });
    });

    it('DELETE request to /drawings should call #removeID from imageDataService with correct parameter', async () => {
        const id = new ObjectId().toString();
        const metadata = new Metadata(id, 'stubTitle', ['stubTag1', 'stubTag2'], 100, 100);
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
});
