import { Component } from '@angular/core';
import { PipetteService } from '@app/services/tools/pipette-service/pipette.service';

@Component({
    selector: 'app-pipette-preview',
    templateUrl: './pipette-preview.component.html',
    styleUrls: ['./pipette-preview.component.scss'],
})
export class PipettePreviewComponent {
    constructor(public pipette: PipetteService) {}
}
