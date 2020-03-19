import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http' 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { MyBarChartComponent } from './my-bar-chart/my-bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    BubbleChartComponent,
    MyBarChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
