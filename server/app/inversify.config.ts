import { DatabaseController } from '@app/controllers/database-controller/database.controller';
import { DateController } from '@app/controllers/date-controller/date.controller';
import { IndexController } from '@app/controllers/index-controller/index.controller';
import { DatabaseService } from '@app/services/database-service/database.service';
import { DateService } from '@app/services/date-service/date.service';
import { IndexService } from '@app/services/index-service/index.service';
import { Container } from 'inversify';
import { Application } from './app';
import { ImageDataService } from './controllers/database-controller/image-data/image-data.service';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.IndexService).to(IndexService);

    container.bind(TYPES.DatabaseController).to(DatabaseController);
    container.bind(TYPES.DatabaseService).to(DatabaseService);

    container.bind(TYPES.DateController).to(DateController);
    container.bind(TYPES.DateService).to(DateService);

    container.bind(TYPES.ImageDataService).to(ImageDataService);

    return container;
};
