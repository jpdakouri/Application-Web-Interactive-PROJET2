import { Metadata } from '@app/classes/metadata';
import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';

@injectable()
export class ImageDataService {
    drawingData: DrawingData[] = new Array();
    updateDrawing(drawingData: DrawingData): boolean {
        const index = this.drawingData.findIndex((item: DrawingData) => item.id === drawingData.id);
        if (index >= 0) {
            this.drawingData[index].imageData = drawingData.imageData;
            this.drawingData[index].title = drawingData.title;
            this.drawingData[index].tags = drawingData.tags;
            return true;
        } else {
            return false;
        }
    }
    insertDrawing(drawingData: DrawingData): void {
        this.drawingData.push(drawingData);
    }

    filterArray(result: Metadata[]): DrawingData[] {
        this.drawingData = this.drawingData.filter((drawingData) => result.find((metadata) => metadata._id === drawingData.id));
        return this.drawingData;
    }

    removeID(id: string): void {
        this.drawingData = this.drawingData.filter((drawingData) => !(drawingData.id === id));
    }
}
