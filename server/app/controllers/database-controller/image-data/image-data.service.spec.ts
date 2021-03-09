import * as chai from 'chai';
import * as spies from 'chai-spies';
import { describe } from 'mocha';
import { DrawingData } from '../../../../../common/communication/drawing-data';
import { Metadata } from '../../../../../common/communication/metadata';
import { ImageDataService } from './image-data.service';
chai.use(spies);
const expect = chai.expect;

describe('ImageDataService', () => {
    let service: ImageDataService = new ImageDataService();

    beforeEach(() => {
        service.drawingData = [];
    });

    it('#insertDrawing should insert drawing', () => {
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawings: DrawingData[] = [];
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], imageData);
            service.insertDrawing(drawingData);
            drawings.push(drawingData);
        }
        drawings.forEach((element, index) => {
            expect(element).to.deep.equal(service.drawingData[index]);
        });
    });

    it('#updateDrawing should update drawing and return true', () => {
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], imageData);
            service.drawingData.push(drawingData);
        }
        const updatedImageData = ({ data: [100, 100], height: 100, width: 100 } as unknown) as ImageData;
        const updatedDrawingData = new DrawingData('3', 'updated', ['updated', 'updated'], updatedImageData);
        expect(service.updateDrawing(updatedDrawingData)).to.equal(true);
        expect(service.drawingData[3]).to.deep.equal(updatedDrawingData);
    });

    it('#updateDrawing should return false if no drawing was found', () => {
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], imageData);
            service.drawingData.push(drawingData);
        }
        const updatedImageData = ({ data: [100, 100], height: 100, width: 100 } as unknown) as ImageData;
        const updatedDrawingData = new DrawingData('10', 'updated', ['updated', 'updated'], updatedImageData);
        expect(service.updateDrawing(updatedDrawingData)).to.equal(false);
    });

    it('#filterArray should filter Array with array passed by parameter', () => {
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        const drawings: Metadata[] = [];
        for (let i = 0; i < 10; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], imageData);
            service.drawingData.push(drawingData);
            if (i > 4) {
                drawings.push(new Metadata(drawingData.id, drawingData.title, drawingData.tags));
            }
        }
        service.filterArray(drawings);
        expect(service.drawingData.length).to.equal(5);
        for (let i = 0; i < 5; i++) {
            expect(service.drawingData[i].title).to.equal(drawings[i].title);
            expect(service.drawingData[i].id).to.equal(drawings[i]._id);
            expect(service.drawingData[i].tags).to.deep.equal(drawings[i].tags);
        }
    });
    it('#removeID should remove data correspondind to ID', () => {
        const imageData = ({ data: [], height: 0, width: 0 } as unknown) as ImageData;
        for (let i = 0; i < 10; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], imageData);
            service.drawingData.push(drawingData);
        }
        service.removeID('5');
        expect(service.drawingData.length).to.equal(9);
        expect(service.drawingData.findIndex((item: DrawingData) => item.id === '5')).to.equal(-1);
    });
});
