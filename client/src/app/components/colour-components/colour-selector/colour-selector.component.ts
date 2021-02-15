import { Component } from '@angular/core';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';
const PERCENTAGE_MAX = 100;
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
        this.currentColourService.setPrimaryColorRgb(this.convertHexColorToDec());
        this.rgbColor = '';
    }

    setSecondaryColor(): void {
        this.currentColourService.setSecondaryColorRgb(this.convertHexColorToDec());
        this.rgbColor = '';
    }

    onPrimaryColorTransparencyEntryChange(): void {
        if (this.isValidTransparency(this.primaryColourTransparency)) {
            const TRANSPARENCY_RGB = Math.round(Number(this.primaryColourTransparency) / PERCENTAGE_MAX);
            this.currentColourService.setPrimaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    onSecondaryColorTransparencyEntryChange(): void {
        if (this.isValidTransparency(this.secondaryColourTransparency)) {
            const TRANSPARENCY_RGB = Math.round(Number(this.secondaryColourTransparency) / PERCENTAGE_MAX);
            this.currentColourService.setSecondaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    isValidRGB(): boolean {
        if (this.rgbColor === '' || this.rgbColor == undefined) return false;

        const HEX_CHARACTERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F'];
        const MIN_HEX_RGB_VALUE = 1;
        const MAX_HEX_RGB_VALUE = 2;
        const INDEX_ELEMENT_NOT_THERE = -1;

        const RGB_VALUES = this.rgbColor.split(',');
        const RGB_COMPONENTS = 3;
        if (RGB_VALUES.length !== RGB_COMPONENTS) return false;

        let validRgb = true;
        RGB_VALUES.forEach((value) => {
            if (value.length < MIN_HEX_RGB_VALUE || value.length > MAX_HEX_RGB_VALUE) validRgb = false;
            for (let i = 0; i < value.length - 1; i++) {
                if (HEX_CHARACTERS.indexOf(value[i]) === INDEX_ELEMENT_NOT_THERE) validRgb = false;
            }
        });
        return validRgb;
    }

    isValidTransparency(transparency: string): boolean {
        const MIN_TRANSPARENCY = 0;
        const MAX_TRANSPARENCY = 100;
        if (transparency === '') return false;
        if (Number(transparency) == undefined) return false;
        if (!Number.isInteger(Number(transparency))) return false;
        return Number(transparency) >= MIN_TRANSPARENCY && Number(transparency) <= MAX_TRANSPARENCY;
    }

    private convertHexColorToDec(): string {
        let convertedString = '';
        const rgbValues = this.rgbColor.split(',');
        for (const rgbValue of rgbValues) {
            if (convertedString !== '') convertedString += ',';
            convertedString += parseInt(rgbValue, 16).toString();
        }
        return convertedString;
    }
}
