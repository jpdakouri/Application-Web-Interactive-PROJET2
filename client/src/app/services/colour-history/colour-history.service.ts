import { Injectable } from '@angular/core';
const HISTORY_LENGTH = 10;
@Injectable({
  providedIn: 'root'
})
export class ColourHistoryService {
    private colours: string[];

    constructor() {
        const RBGA_WHITE = 'rgba(255,255,255,1)';
        this.colours = [];
        for (let i = 0; i < HISTORY_LENGTH; i++) {
            this.colours.push(RBGA_WHITE);
        }
    }
    getColour(index: number): string {
        if (index >= 0 && index < HISTORY_LENGTH)
            return this.colours[index];
        return '';
    }
    pushColour(colour: string): void{
        for (let i = 9; i >= 1; i--) {
            this.colours[i] = this.colours[i-1];
        }
        this.colours.splice(-1,1)
        this.colours.unshift(colour);
    }

    selectColour(colour: string): void {
        for (let i = 9; i >= 1; i--) {
            this.colours[i] = this.colours[i-1];
        }
        this.colours.splice(-1,1)
        this.colours.unshift(colour);
    }
}
