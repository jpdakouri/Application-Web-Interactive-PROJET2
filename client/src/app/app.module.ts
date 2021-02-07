import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColourHistoryComponent } from './components/colour-components/colour-history/colour-history.component';
import { ColourPaletteSelectorComponent } from './components/colour-components/colour-palette-selector/colour-palette-selector.component';
import { ColourSelectorComponent } from './components/colour-components/colour-selector/colour-selector.component';
import { CurrentColorComponent } from './components/colour-components/current-color/current-color.component';
import { HueSelectorComponent } from './components/colour-components/hue-selector/hue-selector.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ToolAttributeBarComponent } from './components/toolbar-components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from './components/toolbar-components/toolbar/toolbar.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        DrawingComponent,
        MainPageComponent,
        ColourSelectorComponent,
        HueSelectorComponent,
        ColourPaletteSelectorComponent,
        CurrentColorComponent,
        ColourHistoryComponent,
        ToolbarComponent,
        ToolAttributeBarComponent,
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, BrowserAnimationsModule, AppMaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
