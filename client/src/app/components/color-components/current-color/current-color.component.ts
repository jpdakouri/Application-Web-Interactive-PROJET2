import { Component } from '@angular/core';
import { CurrentColorService } from '@app/services/current-color/current-color.service';

@Component({
    selector: 'app-current-color',
    templateUrl: './current-color.component.html',
    styleUrls: ['./current-color.component.scss'],
})
export class CurrentColorComponent {
    constructor(public currentColorService: CurrentColorService) {}

    swapColors(): void {
        this.currentColorService.swapColors();
    }
}
