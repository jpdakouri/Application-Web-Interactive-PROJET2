import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ColourSelectorComponent } from './components/colour-selector/colour-selector.component';
import { HueSelectorComponent } from './components/hue-selector/hue-selector.component';
import { ColourPaletteSelectorComponent } from './components/colour-palette-selector/colour-palette-selector.component';
import { FormsModule } from '@angular/forms';
import { CurrentColorComponent } from './components/current-color/current-color.component';
import { ColourHistoryComponent } from './components/colour-history/colour-history.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, ColourSelectorComponent, HueSelectorComponent, ColourPaletteSelectorComponent, CurrentColorComponent, ColourHistoryComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
