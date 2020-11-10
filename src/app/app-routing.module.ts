import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WordComponent } from './word/word.component';
import { PictureComponent } from './picture/picture.component';
import { SentenceComponent } from './sentence/sentence.component';
import { StoryComponent } from './story/story.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'word', component: WordComponent },
  { path: 'picture', component: PictureComponent },
  { path: 'sentence', component: SentenceComponent },
  { path: 'story', component: StoryComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'word',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
