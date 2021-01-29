import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [],
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatGridListModule, MatDividerModule, MatButtonModule],
    exports: [MatToolbarModule, MatIconModule, MatGridListModule, MatDividerModule, MatButtonModule],
})
export class AppMaterialModule {}
