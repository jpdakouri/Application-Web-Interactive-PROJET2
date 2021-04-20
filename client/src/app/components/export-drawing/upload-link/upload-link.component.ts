import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-upload-link',
    templateUrl: './upload-link.component.html',
    styleUrls: ['./upload-link.component.scss'],
})
export class UploadLinkComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string, public snackBar: MatSnackBar) {}
}
