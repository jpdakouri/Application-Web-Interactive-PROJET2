import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolAttributeBarComponent } from './components/tool-attribute-bar/tool-attribute-bar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, ToolbarComponent, ToolAttributeBarComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, AppMaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
