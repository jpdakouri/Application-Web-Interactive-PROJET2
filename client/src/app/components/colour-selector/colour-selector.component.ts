import { Component } from '@angular/core';

@Component({
    selector: 'app-colour-selector',
    templateUrl: './colour-selector.component.html',
    styleUrls: ['./colour-selector.component.scss'],
})
export class ColourSelectorComponent {
    // Code inspiré par https://malcoded.com/posts/angular-color-picker/
    hue: string;
    color: string;
}
