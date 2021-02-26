import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { Metadata } from '@common/communication/metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 404;
@injectable()
export class DatabaseController {
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.startDB(this.databaseService.databaseURI, this.databaseService.options);
        this.configureRouter();
    }

    router: Router;

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/insert', (req: Request, res: Response, next: NextFunction) => {
            const metadata = req.body;
            const newDrawing = new Metadata(metadata._id, metadata.title, metadata.tags);
            this.databaseService
                .insertDrawing(newDrawing)
                .then((result) => {
                    if (result.insertedCount > 0) {
                        res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                    } else {
                        res.status(HTTP_STATUS_BAD_REQUEST).send('Document could not be inserted in the database');
                    }
                    console.log(result);
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error: ' + err);
                    console.log(err);
                });
        });
    }
}
