import { Component } from '@angular/core';
import { ColourHistoryService } from '@app/services/colour-history/colour-history.service';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

@Component({
    selector: 'app-colour-history',
    templateUrl: './colour-history.component.html',
    styleUrls: ['./colour-history.component.scss'],
})
export class ColourHistoryComponent {
    constructor(public historyService: ColourHistoryService, private currentColorService: CurrentColourService) {}

    selectPrimaryColor(index: number): void {
        const colour = this.historyService.getColour(index);
        this.currentColorService.setPrimaryColorRgb(this.filterRGB(colour));
    }
    selectSecondaryColor(index: number): void {
        const colour = this.historyService.getColour(index);
        this.currentColorService.setSecondaryColorRgb(this.filterRGB(colour));
    }
    private filterRGB(colour: string): string {
        const RGB_BEGIN_INDICATOR = '(';
        const RGB_END_INDICATOR = ')';
        return colour.substring(colour.indexOf(RGB_BEGIN_INDICATOR) + 1, colour.indexOf(RGB_END_INDICATOR) - 1);
    }
}
