import { Component } from '@angular/core';
import {
    INDEX_ELEMENT_NOT_THERE,
    MAX_HEX_RGB_VALUE,
    MAX_TRANSPARENCY,
    MIN_HEX_RGB_VALUE,
    MIN_TRANSPARENCY,
    PERCENTAGE_MAX,
    RGB_COMPONENTS,
} from '@app/components/components-constants';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

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
            const TRANSPARENCY_RGB = Number(this.primaryColourTransparency) / PERCENTAGE_MAX;
            this.currentColourService.setPrimaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    onSecondaryColorTransparencyEntryChange(): void {
        if (this.isValidTransparency(this.secondaryColourTransparency)) {
            const TRANSPARENCY_RGB = Number(this.secondaryColourTransparency) / PERCENTAGE_MAX;
            this.currentColourService.setSecondaryColorTransparency(TRANSPARENCY_RGB.toString());
        }
    }

    isValidRGB(): boolean {
        if (this.rgbColor === '' || this.rgbColor == undefined) return false;

        const hexCharaters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F'];
        const rgbValues = this.rgbColor.split(',');

        if (rgbValues.length !== RGB_COMPONENTS) return false;

        let validRgb = true;
        rgbValues.forEach((value) => {
            if (value.length < MIN_HEX_RGB_VALUE || value.length > MAX_HEX_RGB_VALUE) validRgb = false;
            for (let i = 0; i < value.length - 1; i++) {
                if (hexCharaters.indexOf(value[i]) === INDEX_ELEMENT_NOT_THERE) validRgb = false;
            }
        });
        return validRgb;
    }

    isValidTransparency(transparency: string): boolean {
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
