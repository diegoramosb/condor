import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TweetsComponent } from './tweets/tweets.component'
import { DashboardComponent } from './dashboard/dashboard.component'


const routes: Routes = [
  {path:"tweets", component: TweetsComponent},
  {path:"", component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
