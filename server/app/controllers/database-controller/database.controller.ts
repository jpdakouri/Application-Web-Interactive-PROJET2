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
@injectable()
export class DatabaseController {
    router: Router;

    constructor(
        @inject(TYPES.DatabaseService) private databaseService: DatabaseService,
        @inject(TYPES.ImageDataService) private imageDataService: ImageDataService,
    ) {
        this.databaseService.startDB(this.databaseService.databaseURI, this.databaseService.options).then(() => {
            this.databaseService.getDrawingsByTags([]).then((result) => {
                if (result.length > 0) {
                    this.imageDataService.populateArray(result, false);
                }
            });
        });

        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const drawingData = req.body as DrawingData;
            const newMetadata = new Metadata(undefined, drawingData.title, drawingData.tags, drawingData.width, drawingData.height);
            if (!this.imageDataService.insertNameCheckUp(drawingData)) res.status(HTTP_STATUS_BAD_REQUEST).send('Message du serveur: Nom Invalide !');
            if (!this.imageDataService.insertTagsCheckUp(drawingData))
                res.status(HTTP_STATUS_BAD_REQUEST).send('Message du serveur: Étiquette Invalide !');
            else
                this.databaseService
                    .insertDrawing(newMetadata)
                    .then((result) => {
                        if (result.insertedCount > 0) {
                            drawingData.id = result.insertedId?.toString();
                            this.imageDataService.writeDrawingToDisk(drawingData);
                            res.status(HTTP_STATUS_CREATED).json(result.insertedId);
                        } else {
                            res.status(HTTP_STATUS_BAD_REQUEST).send("Le document n'a pas pu être inséré dans la base de données !");
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(HTTP_STATUS_ERROR).send("Erreur d'opération dans le serveur !");
                    });
        });

        this.router.get('/length/:tagFlag', (req: Request, res: Response, next: NextFunction) => {
            res.status(HTTP_STATUS_OK).json(
                req.params.tagFlag === 'true' ? this.imageDataService.filteredDrawingData.length : this.imageDataService.drawingData.length,
            );
        });
        this.router.get('/single', (req: Request, res: Response, next: NextFunction) => {
            const index = req.query.index;
            const tagFlag = req.query.tagFlag === 'true';
            if (index) {
                const drawing = this.imageDataService.getOneImageFromDisk(+index, tagFlag);
                if (drawing) {
                    res.status(HTTP_STATUS_OK).json(drawing);
                } else {
                    res.status(HTTP_STATUS_NOT_FOUND).send('Aucun dessin trouvé !');
                }
            }
        });

        this.router.post('/tags', (req: Request, res: Response, next: NextFunction) => {
            const tags = req.body as string[];
            console.log(tags);
            this.databaseService
                .getDrawingsByTags(tags)
                .then((results) => {
                    if (results.length > 0) {
                        this.imageDataService.populateArray(results, true);
                        res.status(HTTP_STATUS_OK).json('Tags bien reçus');
                    } else {
                        this.imageDataService.populateArray(results, true);
                        res.status(HTTP_STATUS_NOT_FOUND).json('Aucun dessin trouvé !');
                    }
                })
                .catch(() => {
                    res.status(HTTP_STATUS_ERROR).send("Erreur d'opération dans le serveur !");
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
                            res.status(HTTP_STATUS_OK).json('Dessin supprimé !');
                        } else {
                            res.status(HTTP_STATUS_NOT_FOUND).send('Aucun dessin trouvé !');
                        }
                    })
                    .catch((err) => {
                        res.status(HTTP_STATUS_ERROR).send("Erreur d'opération dans le serveur !");
                    });
            } else {
                res.status(HTTP_STATUS_BAD_REQUEST).send('ID invalide !');
            }
        });
    }
}
