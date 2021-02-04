import { Component } from '@angular/core';
import { CurrentColourService } from '../../services/current-colour/current-colour.service';

@Component({
    selector: 'app-current-color',
    templateUrl: './current-color.component.html',
    styleUrls: ['./current-color.component.scss'],
})
export class CurrentColorComponent {
    constructor(public currentColourService: CurrentColourService) {}

    swapColours(): void {
        this.currentColourService.swapColors();
    }
}
