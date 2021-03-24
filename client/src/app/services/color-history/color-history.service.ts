import { Injectable } from '@angular/core';
import { DEFAULT_COLOR } from '@app/utils/enums/rgb-settings';
export const HISTORY_LENGTH = 10;
@Injectable({
    providedIn: 'root',
})
export class ColorHistoryService {
    private colors: string[];

    constructor() {
        this.colors = [];
        for (let i = 0; i < HISTORY_LENGTH; i++) {
            this.colors.push(DEFAULT_COLOR);
        }
    }

    getColor(index: number): string {
        if (index >= 0 && index < HISTORY_LENGTH) return this.colors[index];
        return '';
    }

    pushColor(color: string): void {
        const LAST_ELEMENT_INDEX = -1;
        this.colors.splice(LAST_ELEMENT_INDEX, 1);
        this.colors.unshift(color);
    }
}
