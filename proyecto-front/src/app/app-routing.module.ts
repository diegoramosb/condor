import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TweetsComponent } from './tweets/tweets.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { BarHistoricSettingsComponent } from './bar-historic-settings/bar-historic-settings.component'


const routes: Routes = [
  {path: "tweets", component: TweetsComponent},
  {path: "", component: DashboardComponent},
  {path: "historic-settings", component: BarHistoricSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
