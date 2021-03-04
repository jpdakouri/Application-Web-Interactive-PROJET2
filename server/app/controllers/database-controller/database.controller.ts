import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { Metadata } from '@common/communication/metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_NO_CONTENT = 204;
@injectable()
export class DatabaseController {
    router: Router;
    drawingData: DrawingData[];

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.startDB(this.databaseService.databaseURI, this.databaseService.options);
        this.configureRouter();
    }

    updateDrawing(drawingData: DrawingData): void {
        const index = this.drawingData.findIndex((item: DrawingData) => (item._id = drawingData._id));
        this.drawingData[index].imageData = drawingData.imageData;
        this.drawingData[index].title = drawingData.title;
        this.drawingData[index].tags = drawingData.tags;
    }

    private configureRouter(): void {
        this.router = Router();

        // TODO PUT REQUEST
        // TESTS

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const drawingData = req.body;
            const newMetadata = new Metadata(drawingData._id, drawingData.title, drawingData.tags);
            this.databaseService
                .insertDrawing(newMetadata)
                .then((result) => {
                    if (result.insertedCount > 0) {
                        res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                        this.drawingData.push(new DrawingData(drawingData._id, drawingData.title, drawingData.tags, drawingData.imageData));
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
                        const response = this.drawingData.filter((metadata) => result.find((data) => data._id === metadata._id));
                        res.status(HTTP_STATUS_OK).json(response);
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

        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.id)
                .then((result) => {
                    if (result.ok) {
                        res.status(HTTP_STATUS_OK).send('Drawing deleted !');
                        this.drawingData = this.drawingData.filter((drawingData) => drawingData._id !== req.params.id);
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

        this.router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
            const drawingData = req.body;
            this.databaseService
                .updateDrawing(drawingData)
                .then((updateResult) => {
                    if (updateResult.result.ok === 1) {
                        res.status(HTTP_STATUS_NO_CONTENT).json('Drawing updated !');
                        this.updateDrawing(drawingData);
                    } else {
                        res.status(HTTP_STATUS_NOT_FOUND).send('Drawing failed to be updated !');
                    }
                    console.log(updateResult);
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    console.log(err);
                });
        });
    }
}
