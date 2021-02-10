import { Component } from '@angular/core';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

@Component({
    selector: 'app-current-colour',
    templateUrl: './current-colour.component.html',
    styleUrls: ['./current-colour.component.scss'],
})
export class CurrentColourComponent {
    constructor(public currentColourService: CurrentColourService) {}

    swapColours(): void {
        this.currentColourService.swapColors();
    }
}
