import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatGridListModule,
        MatDividerModule,
        MatButtonModule,
        MatSliderModule,
        MatButtonToggleModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    exports: [
        MatToolbarModule,
        MatIconModule,
        MatGridListModule,
        MatDividerModule,
        MatButtonModule,
        MatSliderModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
    ],
})
export class AppMaterialModule {}
