import { DrawingData } from '@common/communication/drawing-data';
import { Metadata } from '@common/communication/metadata';
import { injectable } from 'inversify';

@injectable()
export class ImageDataService {
    drawingData: DrawingData[] = new Array();
    updateDrawing(drawingData: DrawingData): void {
        const index = this.drawingData.findIndex((item: DrawingData) => (item.id = drawingData.id));
        if (index >= 0) {
            this.drawingData[index].imageData = drawingData.imageData;
            this.drawingData[index].title = drawingData.title;
            this.drawingData[index].tags = drawingData.tags;
        }
    }
    insertDrawing(drawingData: DrawingData): void {
        this.drawingData.push(drawingData);
    }

    filterArray(result: Metadata[]): DrawingData[] {
        return this.drawingData.filter((drawingData) => result.find((metadata) => metadata._id === drawingData.id));
    }

    removeID(id: string): void {
        this.drawingData = this.drawingData.filter((drawingData) => !(drawingData.id === id));
    }
}
