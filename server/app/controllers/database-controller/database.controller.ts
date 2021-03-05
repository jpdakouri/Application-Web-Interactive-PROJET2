import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { Metadata } from '@common/communication/metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_NO_CONTENT = 204;
@injectable()
export class DatabaseController {
    router: Router;
    drawingData: DrawingData[] = new Array();

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
            // console.log(req.body);
            const newMetadata = new Metadata(new ObjectId(drawingData._id), drawingData.title, drawingData.tags);
            this.databaseService
                .insertDrawing(newMetadata)
                .then((result) => {
                    if (result.insertedCount > 0) {
                        res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                        this.drawingData.push(
                            new DrawingData(new ObjectId(result.insertedId), drawingData.title, drawingData.tags, drawingData.imageData),
                        );
                        console.log('id: ' + this.drawingData[this.drawingData.length - 1]._id);
                    } else {
                        res.status(HTTP_STATUS_BAD_REQUEST).send('Document could not be inserted in the database !');
                    }
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
                        const response = this.drawingData.filter((metadata) => result.find((data) => data._id?.equals(new ObjectId(metadata._id))));
                        console.log(response);
                        res.status(HTTP_STATUS_OK).json(response);
                    } else {
                        res.status(HTTP_STATUS_NOT_FOUND).send('No drawings found !');
                    }
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    console.log(err);
                });
        });

        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            const isValid = ObjectId.isValid(req.params.id);
            if (isValid) {
                this.databaseService
                    .deleteDrawing(req.params.id)
                    .then((result) => {
                        if (result.ok && result.value) {
                            res.status(HTTP_STATUS_OK).json('Drawing deleted !');
                            this.drawingData = this.drawingData.filter((drawingData) => !drawingData._id?.equals(new ObjectId(req.params.id)));
                        } else {
                            res.status(HTTP_STATUS_NOT_FOUND).send('No drawing found !');
                        }
                    })
                    .catch((err) => {
                        res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                        console.log(err);
                    });
            } else {
                res.status(HTTP_STATUS_BAD_REQUEST).send('Invalid ID!');
            }
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
