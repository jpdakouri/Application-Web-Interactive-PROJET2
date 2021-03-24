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

    it('#writeDrawingToDisk should return false and log error if writingFileSync fails', () => {
        const writeStub = sinon.stub(fs, 'writeFileSync').throws("Erreur d'écriture");
        const spy = sinon.spy(console, 'error');
        const drawing = new DrawingData('id', 'title', ['tag1', 'tag2'], 'partToRemove,dataURL', 100, 100);
        expect(service.writeDrawingToDisk(drawing)).to.equal(false);
        expect(spy.callCount).to.equal(2);
        writeStub.restore();
        spy.restore();
    });

    it('#getOneImageFromDisk should call fs.readFileSync with correct parameter and return drawing', () => {
        const data = 'fakeData';
        const readStub = sinon.stub(fs, 'readFileSync').returns(data);
        const readSpy = chai.spy.on(fs, 'readFileSync');
        const existsStub = sinon.stub(fs, 'existsSync').returns(true);
        const mime = 'image/png';
        const encoding = 'base64';
        const uri = `data:${mime};${encoding},${data}`;
        const drawingData = new DrawingData('id', 'title', ['tag1', 'tag2'], uri, 100, 100);
        service.drawingData.push(drawingData);
        expect(service.getOneImageFromDisk(0, false)).to.deep.equal(drawingData);

        expect(readSpy).to.have.been.called.with('./app/drawings/id.png');

        readStub.restore();
        existsStub.restore();
    });

    it('#getOneImageFromDisk should return undefined if theres no drawing in file system', () => {
        const drawingData = new DrawingData('id', 'title', ['tag1', 'tag2'], 'uri', 100, 100);
        service.drawingData.push(drawingData);
        const nonExistingStub = sinon.stub(fs, 'existsSync').returns(false);
        expect(service.getOneImageFromDisk(0, false)).to.equal(undefined);
        service.drawingData = [];
        expect(service.getOneImageFromDisk(0, false)).to.equal(undefined);

        nonExistingStub.restore();
    });

    it('#getOneImageFromDisk should return undefined if theres no drawing in server', () => {
        service.drawingData = [];
        expect(service.getOneImageFromDisk(0, false)).to.equal(undefined);
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

    it('#insertNameCheckUp should return true if name input is valide', () => {
        const valideName = { title: 'aaa111' } as DrawingData;
        const inValideName = { title: 'aaa 111' } as DrawingData;
        expect(service.insertNameCheckUp(valideName)).to.equal(true);
        expect(service.insertNameCheckUp(inValideName)).to.equal(false);
    });

    it('#insertTagsCheckUp should return true if name input is valide', () => {
        const valideTags = { tags: ['aaa111', 'asdsad 1212'] } as DrawingData;
        const inValideTags = { tags: ['aaa! 111'] } as DrawingData;
        expect(service.insertTagsCheckUp(valideTags)).to.equal(true);
        expect(service.insertTagsCheckUp(inValideTags)).to.equal(false);
    });

    it('#populateArray should populate array with drawings found on disk', () => {
        const metadatas: Metadata[] = [];
        const drawingDatas: DrawingData[] = [];
        const existsStub = sinon.stub(fs, 'existsSync').returns(true);
        for (let i = 0; i < 5; i++) {
            const drawingData = new DrawingData(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], undefined, 100, 100);
            const metadata = new Metadata(i.toString(), `title${i}`, [`tag${i}`, `tag${i}`], 100, 100);
            metadatas.push(metadata);
            drawingDatas.push(drawingData);
        }
        service.populateArray(metadatas, false);
        expect(service.drawingData).to.deep.equal(drawingDatas);
        existsStub.restore();
    });
});
