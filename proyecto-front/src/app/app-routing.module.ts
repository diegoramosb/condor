import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TweetsComponent } from './tweets/tweets.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { BarHistoricSettingsComponent } from './bar-historic-settings/bar-historic-settings.component'
import { BubbleSettingsComponent } from './bubble-settings/bubble-settings.component'
import { WordFreqSettingsComponent } from './word-freq-settings/word-freq-settings.component'

const routes: Routes = [
  {path: "tweets", component: TweetsComponent},
  {path: "", component: DashboardComponent},
  {path: "config-historico", component: BarHistoricSettingsComponent},
  {path: "config-burbuja", component: BubbleSettingsComponent},
  {path: "config-frecuencia", component: WordFreqSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
