import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';

@injectable()
export class DrawingDataService {
    drawingData: DrawingData[];

    getDrawing(id: string): DrawingData | undefined {
        return this.drawingData.find((data) => data._id === id);
    }
}
