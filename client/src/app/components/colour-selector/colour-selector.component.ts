import { Component } from '@angular/core';

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

    onInputEntry(event: KeyboardEvent): void {
        if (this.isValidRGB()) this.selectedColor = this.formatToRGBA();
        console.log(this.selectedColor);
    }

    isValidRGB(): boolean {
        console.log(this.rgbColor);
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
            if (Number(value) > 0 && Number(value) < MAX_RGB) containsValidNumbers = false;
            if (!Number.isInteger(value)) containsValidNumbers = false;
        });
        console.log("a");
        return containsValidNumbers;
    }

    formatToRGBA(): string {
        const RGBA_START = 'rgba(';
        const RGBA_END = ',1)';
        return RGBA_START + this.rgbColor + RGBA_END;
    }
}
