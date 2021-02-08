import { Component } from '@angular/core';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
const RGB_MAX = 255;
const PERCENTAGE_MAX = 100;
const PERCENTAGE_TO_ALPHA_RATIO = RGB_MAX / PERCENTAGE_MAX;
@Component({
    selector: 'app-colour-selector',
    templateUrl: './colour-selector.component.html',
    styleUrls: ['./colour-selector.component.scss'],
})
export class ColourSelectorComponent {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/
    hue: string;
    selectedColor: string;

    rgbColor: string;
    primaryColourTransparency: string;
    secondaryColourTransparency: string;

    constructor(private currentColourService: CurrentColourService) {}

    setPrimaryColor(): void {
        this.currentColourService.setPrimaryColorRgb(this.rgbColor);
        this.rgbColor = '';
    }

    setSecondaryColor(): void {
        this.currentColourService.setSecondaryColorRgb(this.rgbColor);
        this.rgbColor = '';
    }

    onPrimaryColorTransparencyEntryChange(): void {
        if (this.isValidTransparency(this.primaryColourTransparency)) {
            const TRANSPARENCY_RGB = Math.round(Number(this.primaryColourTransparency) * PERCENTAGE_TO_ALPHA_RATIO);
            this.currentColourService.setPrimaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    onSecondaryColorTransparencyEntryChange(): void {
        if (this.isValidTransparency(this.secondaryColourTransparency)) {
            const TRANSPARENCY_RGB = Math.round(Number(this.secondaryColourTransparency) * PERCENTAGE_TO_ALPHA_RATIO);
            this.currentColourService.setSecondaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    isValidRGB(): boolean {
        // console.log(this.rgbColor);
        if (this.rgbColor === '' || this.rgbColor == undefined) return false;
        const RGB_VALUES = this.rgbColor.split(',');
        const MAX_RGB = 255;
        const RGB_COMPONENTS = 3;
        if (RGB_VALUES.length !== RGB_COMPONENTS) return false;

        let containsNaN = false;
        RGB_VALUES.forEach((value) => {
            if (isNaN(Number(value))) containsNaN = true;
        });
        if (containsNaN) return false;

        let containsValidNumbers = true;
        RGB_VALUES.forEach((value) => {
            if (Number(value) > 0 && Number(value) < MAX_RGB && !Number.isInteger(value)) containsValidNumbers = false;
            if (!Number.isInteger(value)) containsValidNumbers = false;
        });
        console.log('a');
        return containsValidNumbers;
    }

    isValidTransparency(transparency: string): boolean {
        const MIN_TRANSPARENCY = 0;
        const MAX_TRANSPARENCY = 100;
        if (Number(transparency) == undefined) return false;
        if (Number.isInteger(Number(transparency))) return false;
        return Number(transparency) >= MIN_TRANSPARENCY && Number(transparency) <= MAX_TRANSPARENCY;
    }

    formatToRGBA(): string {
        const RGBA_START = 'rgba(';
        const RGBA_END = ',1)';
        return RGBA_START + this.rgbColor + RGBA_END;
    }
}
