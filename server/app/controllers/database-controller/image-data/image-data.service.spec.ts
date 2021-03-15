import * as chai from 'chai';
import * as spies from 'chai-spies';
import * as fs from 'fs';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { DrawingData } from '../../../../../common/communication/drawing-data';
import { Metadata } from '../../../classes/metadata';
import { ImageDataService } from './image-data.service';

chai.use(spies);
const expect = chai.expect;
// tslint:disable: no-unused-expression
// tslint:disable: no-magic-numbers
describe('ImageDataService', () => {
    const service: ImageDataService = new ImageDataService();

    beforeEach(() => {
        service.drawingData = [];
    });

    it('#writeDrawingToDisk should insert drawing into drawingData array and call fs.writeFileSync with correct parameters', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync');
        const writeSpy = chai.spy.on(fs, 'writeFileSync');
        const dataURL = 'partToRemove,dataURLStub';
        const drawings: DrawingData[] = [];
        const buf = Buffer.from('dataURLStub', 'base64');
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            const bool = service.writeDrawingToDisk(drawingData);
            expect(bool).to.be.true;
            drawings.push(drawingData);
        }
        drawings.forEach((element, index) => {
            expect(element).to.deep.equal(service.drawingData[index]);
            expect(writeSpy).to.have.been.called.with(`./app/drawings/${index}.png`, buf, { flag: 'w' });
        });
        expect(writeSpy).to.have.been.called.exactly(5);
        writeStub.restore();
    });

    it('#writeDrawingToDisk should return false if dataURL is undefined', () => {
        const drawingData = new DrawingData('1234', 'title', ['tag1', 'tag$2'], undefined, 100, 100);
        expect(service.writeDrawingToDisk(drawingData)).to.be.false;
    });

    it('#updateDrawing should update drawingData array and call fs.writeFileSync and return true', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync');
        const writeSpy = chai.spy.on(fs, 'writeFileSync');
        const dataURL = 'partToRemove,dataURLStub';
        const buf = Buffer.from('updatedDataURLStub', 'base64');

        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            service.drawingData.push(drawingData);
        }
        const updatedDataURL = 'partToRemove,updatedDataURLStub';
        const updatedDrawingData = new DrawingData('3', 'updated', ['updated', 'updated'], updatedDataURL, 200, 200);
        expect(service.updateDrawing(updatedDrawingData)).to.equal(true);
        expect(writeSpy).to.have.been.called.with('./app/drawings/3.png', buf, { flag: 'w' });
        expect(service.drawingData[3]).to.deep.equal(updatedDrawingData);
        writeStub.restore();
    });

    it('#updateDrawing should return false if no drawing was found', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync');

        const dataURL = 'dataURLStub';
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            service.drawingData.push(drawingData);
        }
        const updatedDataURL = 'updatedDataURLStub';
        const updatedDrawingData = new DrawingData('10', 'updated', ['updated', 'updated'], updatedDataURL, 200, 200);
        expect(service.updateDrawing(updatedDrawingData)).to.equal(false);
        writeStub.restore();
    });

    it('#getImagesFromDisk should call #filterArray with correct parameter', () => {
        const dataURL = 'dataURLStub';
        const readStub = sinon.stub(fs, 'readFileSync').returns(dataURL);
        const spy = chai.spy.on(service, 'filterArray');
        const metadatas: Metadata[] = [];
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            const metadata = new Metadata(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], 100, 100);
            metadatas.push(metadata);
            service.drawingData.push(drawingData);
        }
        service.getImagesFromDisk(metadatas);
        expect(spy).to.have.been.called.with(metadatas);
        readStub.restore();
    });

    it('#getImagesFromDisk should call fs.readFileSync with correct parameter and return array of drawings', () => {
        const data = 'fakeData';
        const readStub = sinon.stub(fs, 'readFileSync').returns(data);
        const readSpy = chai.spy.on(fs, 'readFileSync');
        const mime = 'image/png';
        const encoding = 'base64';
        const uri = `data:${mime};${encoding},${data}`;
        const metadatas: Metadata[] = [];
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], uri, 100, 100);
            service.drawingData.push(drawingData);
            const metadata = new Metadata(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], 100, 100);
            metadatas.push(metadata);
        }
        expect(service.getImagesFromDisk(metadatas)).to.deep.equal(service.drawingData);
        for (let i = 0; i < 5; i++) {
            expect(readSpy).to.have.been.called.with(`./app/drawings/${i}.png`);
        }
        readStub.restore();
    });

    it('#filterArray should filter Array with array passed by parameter', () => {
        const dataURL = 'dataURLStub';
        const drawings: Metadata[] = [];
        for (let i = 0; i < 10; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            service.drawingData.push(drawingData);
            if (i > 4) {
                drawings.push(new Metadata(drawingData.id, drawingData.title, drawingData.tags, 100, 100));
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

    it('#removeID should remove data correspondind to ID and call fs.unlinkSync', () => {
        const unlinkStub = sinon.stub(fs, 'unlinkSync');
        const unlinkSpy = chai.spy.on(fs, 'unlinkSync');

        const dataURL = 'dataURLStub';
        for (let i = 0; i < 10; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], dataURL, 100, 100);
            service.drawingData.push(drawingData);
        }
        service.removeID('5');
        expect(unlinkSpy).to.have.been.called.with('./app/drawings/5.png');
        expect(service.drawingData.length).to.equal(9);
        expect(service.drawingData.findIndex((item: DrawingData) => item.id === '5')).to.equal(-1);
        unlinkStub.restore();
    });

    it('#insertCheckUp should return true if name input is valide', () => {
        const valideName = { title: 'aaa111' } as DrawingData;
        const inValideName = { title: 'aaa 111' } as DrawingData;
        expect(service.insertCheckUp(valideName)).to.equal(true);
        expect(service.insertCheckUp(inValideName)).to.equal(false);
    });

    it('#updateDrawing should return false and log error if writingFileSync fails', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync').throws("Erreur d'écriture");
        const spy = sinon.spy(console, 'error');
        const drawing = new DrawingData('id', 'title', ['tag1', 'tag2'], 'partToRemove,dataURL', 100, 100);
        service.drawingData.push(drawing);
        expect(service.updateDrawing(drawing)).to.equal(false);
        expect(spy.callCount).to.equal(2);
        writeStub.restore();
        spy.restore();
    });

    it('#writeDrawingToDisk should return false and log error if writingFileSync fails', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync').throws("Erreur d'écriture");
        const spy = sinon.spy(console, 'error');
        const drawing = new DrawingData('id', 'title', ['tag1', 'tag2'], 'partToRemove,dataURL', 100, 100);
        expect(service.writeDrawingToDisk(drawing)).to.equal(false);
        expect(spy.callCount).to.equal(2);
        writeStub.restore();
        spy.restore();
    });
});
