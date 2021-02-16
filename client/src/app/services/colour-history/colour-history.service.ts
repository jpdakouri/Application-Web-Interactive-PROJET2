import { Injectable } from '@angular/core';
import { DEFAULT_COLOUR } from '@app/services/services-constants';
export const HISTORY_LENGTH = 10;
@Injectable({
    providedIn: 'root',
})
export class ColourHistoryService {
    private colours: string[];

    constructor() {
        this.colours = [];
        for (let i = 0; i < HISTORY_LENGTH; i++) {
            this.colours.push(DEFAULT_COLOUR);
        }
    }

    getColour(index: number): string {
        if (index >= 0 && index < HISTORY_LENGTH) return this.colours[index];
        return '';
    }

    pushColour(colour: string): void {
        const LAST_ELEMENT_INDEX = -1;
        this.colours.splice(LAST_ELEMENT_INDEX, 1);
        this.colours.unshift(colour);
    }
}
