import { Injectable } from '@angular/core';
import { ColourHistoryService } from '@app/services/colour-history/colour-history.service';
const RGB_START = 'rgb(';
const RGBA_START = 'rgba(';
const RGB_RGBA_END = ')';
const RGB_RGBA_SEPARATOR = ',';
const RGB_NUMBER_OF_COLOURS = 3;
@Injectable({
    providedIn: 'root',
})
export class CurrentColourService {
    private primaryColorRgb: string;
    private secondaryColorRgb: string;
    private primaryColorTransparency: string;
    private secondaryColorTransparency: string;

    constructor(private colorHistory: ColourHistoryService) {
        const DEFAULT_PRIMARY_RGB = '0,0,0';
        const DEFAULT_SECONDARY_RGB = '255,255,255';
        const DEFAULT_TRANSPARENCY = '1';

        this.primaryColorRgb = DEFAULT_PRIMARY_RGB;
        this.secondaryColorRgb = DEFAULT_SECONDARY_RGB;

        this.primaryColorTransparency = DEFAULT_TRANSPARENCY;
        this.secondaryColorTransparency = DEFAULT_TRANSPARENCY;
    }

    getPrimaryColorRgb(): string {
        return RGB_START + this.primaryColorRgb + RGB_RGBA_END;
    }
    getPrimaryColorRgba(): string {
        return RGBA_START + this.primaryColorRgb + RGB_RGBA_SEPARATOR + this.primaryColorTransparency + RGB_RGBA_END;
    }

    getSecondaryColorRgb(): string {
        return RGB_START + this.secondaryColorRgb + RGB_RGBA_END;
    }
    getSecondaryColorRgba(): string {
        return RGBA_START + this.secondaryColorRgb + RGB_RGBA_SEPARATOR + this.secondaryColorTransparency + RGB_RGBA_END;
    }

    setPrimaryColorRgb(rgb: string): void {
        if (this.primaryColorRgb !== rgb) {
            this.primaryColorRgb = rgb;
            this.colorHistory.pushColour(this.getPrimaryColorRgb());
        }
    }

    setSecondaryColorRgb(rgb: string): void {
        if (this.secondaryColorRgb !== rgb) {
            this.secondaryColorRgb = rgb;
            this.colorHistory.pushColour(this.getSecondaryColorRgb());
        }
    }

    setPrimaryColorTransparency(transparency: string): void {
        this.primaryColorTransparency = transparency;
    }
    setSecondaryColorTransparency(transparency: string): void {
        this.secondaryColorTransparency = transparency;
    }
    swapColors(): void {
        const temp = this.primaryColorRgb;
        this.primaryColorRgb = this.secondaryColorRgb;
        this.secondaryColorRgb = temp;
    }

    getPrimaryColorHex(): string {
        const colorRGB = this.primaryColorRgb.split(RGB_RGBA_SEPARATOR, RGB_NUMBER_OF_COLOURS);
        return this.rgbToHex(parseInt(colorRGB[0], 10), parseInt(colorRGB[1], 10), parseInt(colorRGB[2], 10));
    }

    getSecondaryColorHex(): string {
        const colorRGB = this.secondaryColorRgb.split(RGB_RGBA_SEPARATOR, RGB_NUMBER_OF_COLOURS);
        return this.rgbToHex(parseInt(colorRGB[0], 10), parseInt(colorRGB[1], 10), parseInt(colorRGB[2], 10));
    }

    // Inspiré de Stack Overflow
    private rgbToHex(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    private componentToHex(component: number): string {
        const hex = component.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
