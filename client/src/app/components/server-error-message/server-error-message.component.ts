import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-server-error-message',
    templateUrl: './server-error-message.component.html',
    styleUrls: ['./server-error-message.component.scss'],
})
export class ServerErrorMessageComponent {
    message: string;
    constructor(public dialogRef: MatDialogRef<ServerErrorMessageComponent>, @Inject(MAT_DIALOG_DATA) data: string) {
        this.message = data;
    }

    close(): void {
        this.dialogRef.close();
    }
}
