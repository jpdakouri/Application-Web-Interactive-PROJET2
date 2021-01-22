import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [],
    imports: [CommonModule, MatToolbarModule, MatIconModule],
    exports: [MatToolbarModule, MatIconModule],
})
export class AppMaterialModule {}
