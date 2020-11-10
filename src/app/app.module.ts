import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgZorroAntdModule } from './nz.module';
import { IconModule } from './nz-icon.module';
import { AudioComponent } from './audio/audio.component';
import { PictureComponent } from './picture/picture.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { WordComponent } from './word/word.component';
import { SentenceComponent } from './sentence/sentence.component';
import { StoryComponent } from './story/story.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AudioComponent,
    WordComponent,
    PictureComponent,
    SentenceComponent,
    StoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    IconModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
