import { expect } from 'chai';
import { describe } from 'mocha';
import { InsertOneWriteOpResult, MongoError } from 'mongodb';
import * as supertest from 'supertest';
import { Metadata } from '../../../../common/communication/metadata';
import { Stubbed, testingContainer } from '../../../test/test-utils';
import { Application } from '../../app';
import { DatabaseService } from '../../services/database-service/database.service';
import { TYPES } from '../../types';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BAD_REQUEST = 404;
const HTTP_STATUS_ERROR = 500;

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;
    const insertResult = { insertedCount: 1, insertedId: 1234 } as InsertOneWriteOpResult<Metadata>;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            startDB: sandbox.stub().resolves(),
            insertDrawing: sandbox.stub().resolves(insertResult),
        });
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('post request to /insert should respond a HTTP_STATUS_CREATED status code and insertedId if document inserted', async () => {
        return supertest(app)
            .post('/api/database/insert')
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body).to.deep.equal(insertResult.insertedId);
            });
    });

    it('post request to /insert should respond a HTTP_STATUS_BAD_REQUEST and string message if document not inserted', async () => {
        insertResult.insertedCount = 0;
        databaseService.insertDrawing.resolves(insertResult);
        return supertest(app)
            .post('/api/database/insert')
            .expect(HTTP_STATUS_BAD_REQUEST)
            .then((response: any) => {
                expect(response.text).to.deep.equal('Document could not be inserted in the database !');
            });
    });

    it('post request to /insert should respond a HTTP_STATUS_ERROR and string message if database error', async () => {
        databaseService.insertDrawing.rejects(new MongoError('Test Error'));
        return supertest(app)
            .post('/api/database/insert')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.text).to.deep.equal('Database operation error !');
            });
    });
});
