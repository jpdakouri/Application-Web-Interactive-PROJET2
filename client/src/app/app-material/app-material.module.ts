import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [],
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatGridListModule],
    exports: [MatToolbarModule, MatIconModule, MatGridListModule],
})
export class AppMaterialModule {}
