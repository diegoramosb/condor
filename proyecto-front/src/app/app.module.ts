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
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDividerModule } from '@angular/material/divider'; 
import { MatMenuModule } from '@angular/material/menu'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BarHistoricComponent } from './bar-historic/bar-historic.component';
import { BubbleComponent } from './bubble/bubble.component';
import { GraphComponent } from './graph/graph.component';
import { WordFreqComponent } from './word-freq/word-freq.component';
import { TweetsComponent } from './tweets/tweets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraphCardComponent } from './graph-card/graph-card.component';
import { BarHistoricSettingsComponent } from './bar-historic-settings/bar-historic-settings.component';
import { BubbleSettingsComponent } from './bubble-settings/bubble-settings.component';
import { WordFreqSettingsComponent } from './word-freq-settings/word-freq-settings.component';
import { GraphSettingsComponent } from './graph-settings/graph-settings.component';
import { SettingsComponent } from './settings/settings.component';

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
    BarHistoricSettingsComponent,
    BubbleSettingsComponent,
    WordFreqSettingsComponent,
    GraphSettingsComponent,
    SettingsComponent,
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
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
