import { Stubbed, testingContainer } from '../../../test/test-utils';
import { Application } from '../../app';
import { DatabaseService } from '../../services/database-service/database.service';
import { TYPES } from '../../types';

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            start: sandbox.stub().resolves(),
            closeConnection: sandbox.stub().resolves(),
        });
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });
});
