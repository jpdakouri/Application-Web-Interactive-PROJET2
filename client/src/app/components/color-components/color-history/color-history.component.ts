import { Component } from '@angular/core';
import { RGB_BEGIN_INDICATOR, RGB_END_INDICATOR } from '@app/components/components-constants';
import { ColorHistoryService } from '@app/services/color-history/color-history.service';
import { CurrentColorService } from '@app/services/current-color/current-color.service';

@Component({
    selector: 'app-color-history',
    templateUrl: './color-history.component.html',
    styleUrls: ['./color-history.component.scss'],
})
export class ColorHistoryComponent {
    constructor(public historyService: ColorHistoryService, private currentColorService: CurrentColorService) {}

    selectPrimaryColor(index: number): void {
        const color = this.historyService.getColor(index);
        this.currentColorService.setPrimaryColorRgb(this.filterRGB(color));
    }

    selectSecondaryColor(index: number): void {
        const color = this.historyService.getColor(index);
        this.currentColorService.setSecondaryColorRgb(this.filterRGB(color));
    }

    createArray(size: number): number[] {
        return Array(size);
    }

    private filterRGB(color: string): string {
        return color.substring(color.indexOf(RGB_BEGIN_INDICATOR) + 1, color.indexOf(RGB_END_INDICATOR));
    }
}
