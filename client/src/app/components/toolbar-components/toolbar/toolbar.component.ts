import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HttpService } from '@app/services/http/http.service';
import { ToolManagerService } from '@app/services/tool-manager/tool-manager.service';
import { ToolsNames } from '@app/utils/enums/tools-names';
import { DrawingData } from '@common/communication/drawing-data';
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    toolsNames: typeof ToolsNames = ToolsNames;
    toolManagerService: ToolManagerService;
    drawingService: DrawingService;
    ids: string[] = [];

    constructor(toolManagerService: ToolManagerService, drawingService: DrawingService, private http: HttpService) {
        this.toolManagerService = toolManagerService;
        this.drawingService = drawingService;
    }

    setCurrentTool(toolName: ToolsNames): void {
        this.toolManagerService.emitToolChange(toolName);
    }

    isSelected(toolName: ToolsNames): boolean {
        return this.toolManagerService.isCurrentTool(toolName);
    }

    onCreateNewDrawing(): void {
        this.drawingService.createNewDrawing();
    }

    insertDrawing() {
        const imageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.width);
        const drawingData = new DrawingData(undefined, 'youcef', ['youceftag1', 'youceftag2'], imageData);
        this.http.insertDrawing(drawingData).subscribe({
            next: (result) => {
                console.log(result);
                this.ids.push(result);
            },
        });
    }

    deleteDrawing() {
        const id = this.ids.pop();
        this.http.deleteDrawing(id ? id : this.ids[0]).subscribe({ next: (result) => console.log(result) });
    }
    getDrawings() {
        this.http.getAllDrawings().subscribe({
            next: (result) => {
                result.forEach((element) => {
                    console.log(element);
                });
            },
        });
    }
}
