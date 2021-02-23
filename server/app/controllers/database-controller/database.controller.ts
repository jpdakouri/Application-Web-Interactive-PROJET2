import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DatabaseController {
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.start();
        this.configureRouter();
    }

    router: Router;

    private configureRouter(): void {
        this.router = Router();
    }
}
