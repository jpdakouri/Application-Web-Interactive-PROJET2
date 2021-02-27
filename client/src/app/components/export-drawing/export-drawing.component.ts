import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<ExportDrawingComponent>) {}

    ngOnInit(): void {}

    exportDrawing(): void {}

    onDialogClose(): void {
        this.dialogRef.close(ExportDrawingComponent);
    }
}
