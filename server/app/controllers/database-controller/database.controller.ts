import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { Metadata } from '@common/communication/metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
@injectable()
export class DatabaseController {
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.startDB(this.databaseService.databaseURI, this.databaseService.options);
        this.configureRouter();
    }

    router: Router;

    private configureRouter(): void {
        this.router = Router();

        // TODO PUT REQUEST
        // TESTS

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const metadata = req.body;
            const newDrawing = new Metadata(metadata._id, metadata.title, metadata.tags);
            this.databaseService
                .insertDrawing(newDrawing)
                .then((result) => {
                    if (result.insertedCount > 0) {
                        res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                    } else {
                        res.status(HTTP_STATUS_BAD_REQUEST).send('Document could not be inserted in the database !');
                    }
                    console.log(result);
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    console.log(err);
                });
        });

        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((result) => {
                    if (result.length > 0) {
                        res.status(HTTP_STATUS_OK).json(result);
                    } else {
                        res.status(HTTP_STATUS_NOT_FOUND).send('No drawings found !');
                    }
                    console.log(result);
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    console.log(err);
                });
        });

        this.router.delete('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.id)
                .then((result) => {
                    if (result.ok) {
                        res.status(HTTP_STATUS_OK).send('Drawing deleted !');
                    } else {
                        res.status(HTTP_STATUS_NOT_FOUND).send('No drawing found !');
                    }
                    console.log(result);
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    console.log(err);
                });
        });

        // this.router.put('/', (req: Request, res: Response, next: NextFunction) => {
        //     this.databaseService
        //         .getAllDrawings()
        //         .then((result) => {
        //             if (result.length > 0) {
        //                 res.status(HTTP_STATUS_OK).json(result);
        //             } else {
        //                 res.status(HTTP_STATUS_NOT_FOUND).send('No drawings found !');
        //             }
        //             console.log(result);
        //         })
        //         .catch((err) => {
        //             res.status(HTTP_STATUS_ERROR).send('Database operation error !');
        //             console.log(err);
        //         });
        // });
    }
}
