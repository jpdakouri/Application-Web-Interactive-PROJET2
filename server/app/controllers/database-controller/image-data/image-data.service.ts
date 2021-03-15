import { Metadata } from '@app/classes/metadata';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { injectable } from 'inversify';

const FILE_NAME_REGEX = /^[a-zA-Z0-9-_]*$/;
const TAG_NAME_REGEX = /^[a-zA-Z0-9 ]*$/;
@injectable()
export class ImageDataService {
    drawingData: DrawingData[] = new Array();

    updateDrawing(drawingData: DrawingData): boolean {
        const index = this.drawingData.findIndex((item: DrawingData) => item.id === drawingData.id);
        if (index >= 0 && drawingData.dataURL) {
            const data = drawingData.dataURL.split(',')[1];
            const buf = Buffer.from(data, 'base64');
            try {
                fs.writeFileSync(`./app/drawings/${drawingData.id}.png`, buf, { flag: 'w' });
            } catch (err) {
                console.error("Une erreur est survenue lors de l'écriture sur le disque");
                console.error(err);
                return false;
            }
            console.log("L'image a bien été écrite sur le disque !");
            this.drawingData[index].title = drawingData.title;
            this.drawingData[index].tags = drawingData.tags;
            this.drawingData[index].width = drawingData.width;
            this.drawingData[index].height = drawingData.height;
            this.drawingData[index].dataURL = drawingData.dataURL;
            return true;
        } else {
            console.log("Aucun dessin trouvé, l'image n'a pas été écrite sur le disque !");
            return false;
        }
    }
    writeDrawingToDisk(drawingData: DrawingData): boolean {
        if (drawingData.dataURL) {
            const data = drawingData.dataURL.split(',')[1];
            const buf = Buffer.from(data, 'base64');
            try {
                fs.writeFileSync(`./app/drawings/${drawingData.id}.png`, buf, { flag: 'w' });
            } catch (err) {
                console.error("Une erreur est survenue lors de l'écriture sur le disque !");
                console.error(err);
                return false;
            }
            this.drawingData.push(drawingData);
            console.log("L'image a bien été écrite sur le disque !");
            return true;
        } else {
            console.log('Le dataURL est indéfinie');
            return false;
        }
    }

    filterArray(result: Metadata[]): void {
        this.drawingData = this.drawingData.filter((drawingData) => result.find((metadata) => metadata._id === drawingData.id));
    }

    getImagesFromDisk(databaseResult: Metadata[]): DrawingData[] {
        this.filterArray(databaseResult);
        const drawingsToSend: DrawingData[] = [];
        this.drawingData.forEach((element) => {
            const mime = 'image/png';
            const encoding = 'base64';
            let data = '';
            try {
                data = fs.readFileSync(`./app/drawings/${element.id}.png`).toString(encoding);
            } catch (err) {
                console.log('Une erreur est survenue lors de la lecture du disque !');
                console.log(err);
            }
            console.log("L'image a bien été lue du disque !");
            const uri = `data:${mime};${encoding},${data}`;
            drawingsToSend.push(new DrawingData(element.id, element.title, element.tags, uri, element.width, element.height));
        });
        return drawingsToSend;
    }

    removeID(id: string): void {
        try {
            fs.unlinkSync(`./app/drawings/${id}.png`);
        } catch (err) {
            console.log('Une erreur est survenue lors de la suppression sur le disque !');
            console.log(err);
        }
        console.log("L'image a bien été supprimée du disque !");
        this.drawingData = this.drawingData.filter((drawingData) => !(drawingData.id === id));
    }

    insertNameCheckUp(drawingImage: DrawingData): boolean {
        if (!FILE_NAME_REGEX.test(drawingImage.title)) return false;
        return true;
    }

    insertTagsCheckUp(drawingImage: DrawingData): boolean {
        let valideInput = true;
        drawingImage.tags.forEach((tag) => {
            if (!TAG_NAME_REGEX.test(tag)) valideInput = false;
        });
        return valideInput;
    }
}
