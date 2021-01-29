import { Injectable } from '@angular/core';
export const HISTORY_LENGTH = 10;
@Injectable({
    providedIn: 'root',
})
export class ColourHistoryService {
    private colours: string[];

    constructor() {
        const DEFAULT_COLOUR = 'rgba(255,255,255,1)';
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
        for (let i = 9; i >= 1; i--) {
            this.colours[i] = this.colours[i - 1];
        }
        const LAST_ELEMENT_INDEX = -1;
        this.colours.splice(LAST_ELEMENT_INDEX, 1);
        this.colours.unshift(colour);
    }

    selectColour(index: number): string {
        if (index < 0 && index >= HISTORY_LENGTH) return '';
        const SELECTED_COLOUR = this.colours[index];
        this.colours.splice(index, 1);
        this.colours.unshift(SELECTED_COLOUR);
        return SELECTED_COLOUR;
    }
}
