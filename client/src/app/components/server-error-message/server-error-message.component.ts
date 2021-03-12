import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-server-error-message',
    templateUrl: './server-error-message.component.html',
    styleUrls: ['./server-error-message.component.scss'],
})
export class ServerErrorMessageComponent implements OnInit {
    message: string;
    constructor(public dialogRef: MatDialogRef<ServerErrorMessageComponent>, @Inject(MAT_DIALOG_DATA) data: string) {
        this.message = data;
    }

    // tslint:disable-next-line:no-empty
    ngOnInit(): void {
        console.log(this.message);
    }
    close(): void {
        this.dialogRef.close();
    }
}
