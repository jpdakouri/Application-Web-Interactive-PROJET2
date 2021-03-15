import { Metadata } from '@app/classes/metadata';
import { DatabaseService } from '@app/services/database-service/database.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { ImageDataService } from './image-data/image-data.service';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
// const HTTP_STATUS_NO_CONTENT = 204;
@injectable()
export class DatabaseController {
    router: Router;

    constructor(
        @inject(TYPES.DatabaseService) private databaseService: DatabaseService,
        @inject(TYPES.ImageDataService) private imageDataService: ImageDataService,
    ) {
        this.databaseService.startDB(this.databaseService.databaseURI, this.databaseService.options);
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // TODO
        // TESTS

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const drawingData = req.body as DrawingData;
            const newMetadata = new Metadata(undefined, drawingData.title, drawingData.tags);
            if (!this.imageDataService.insertNameCheckUp(drawingData)) res.status(HTTP_STATUS_BAD_REQUEST).send('Message du serveur: Nom Invalide !');
            if (!this.imageDataService.insertTagsCheckUp(drawingData))
                res.status(HTTP_STATUS_BAD_REQUEST).send('Message du serveur: Étiquette Invalide!');
            else
                this.databaseService
                    .insertDrawing(newMetadata)
                    .then((result) => {
                        if (result.insertedCount > 0) {
                            const data = new DrawingData(result.insertedId as string, drawingData.title, drawingData.tags, drawingData.imageData);
                            this.imageDataService.insertDrawing(data);
                            res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                        } else {
                            res.status(HTTP_STATUS_BAD_REQUEST).send("Le document n'a pas pu etre inséséré dans la base de données !");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(HTTP_STATUS_ERROR).send("Erreur d'opération dans le serveur!");
                    });
        });

        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((result) => {
                    if (result.length > 0) {
                        const response = this.imageDataService.filterArray(result);
                        res.status(HTTP_STATUS_OK).json(response);
                    } else {
                        res.status(HTTP_STATUS_NOT_FOUND).send('Pas de dessin trouvé!');
                    }
                })
                .catch((err) => {
                    res.status(HTTP_STATUS_ERROR).send("Erreur d'opération dans le serveur!");
                });
        });

        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            const isValid = ObjectId.isValid(req.params.id);
            if (isValid) {
                this.databaseService
                    .deleteDrawing(req.params.id)
                    .then((result) => {
                        if (result.ok && result.value) {
                            this.imageDataService.removeID(req.params.id as string);
                            res.status(HTTP_STATUS_OK).json('Drawing deleted !');
                        } else {
                            res.status(HTTP_STATUS_NOT_FOUND).send('Drawing not found !');
                        }
                    })
                    .catch((err) => {
                        res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    });
            } else {
                res.status(HTTP_STATUS_BAD_REQUEST).send('Invalid ID !');
            }
        });

        this.router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
            const isValid = ObjectId.isValid(req.params.id);
            if (isValid) {
                const drawingData = req.body as DrawingData;
                const updatedMetadata = new Metadata(drawingData.id, drawingData.title, drawingData.tags);
                this.databaseService
                    .updateDrawing(updatedMetadata)
                    .then((updateResult) => {
                        if (updateResult.ok && updateResult.value) {
                            this.imageDataService.updateDrawing(drawingData);
                            res.status(HTTP_STATUS_OK).json('Drawing updated !');
                        } else {
                            res.status(HTTP_STATUS_NOT_FOUND).send('Drawing not found !');
                        }
                    })
                    .catch((err) => {
                        res.status(HTTP_STATUS_ERROR).send('Database operation error !');
                    });
            } else {
                res.status(HTTP_STATUS_BAD_REQUEST).send('Invalid ID !');
            }
        });
    }
}
