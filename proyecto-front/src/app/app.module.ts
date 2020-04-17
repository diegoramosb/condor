import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http' 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { LayoutModule } from '@angular/cdk/layout';
import { BarHistoricComponent } from './bar-historic/bar-historic.component';
import { BubbleComponent } from './bubble/bubble.component';
import { GraphComponent } from './graph/graph.component';
import { WordFreqComponent } from './word-freq/word-freq.component';
import { TweetsComponent } from './tweets/tweets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraphCardComponent } from './graph-card/graph-card.component';
import { GraphDirective } from './graph.directive';

@NgModule({
  declarations: [
    AppComponent,
    BarHistoricComponent,
    BubbleComponent,
    GraphComponent,
    WordFreqComponent,
    TweetsComponent,
    DashboardComponent,
    GraphCardComponent,
    GraphDirective
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
