import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChartDataSets } from 'chart.js';
import { ApiService } from '../api.service';
import { Label } from 'ng2-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'D/M/YYYY'
  },
  display: {
    dateInput: 'D/M/YYYY'
  }
}

@Component({
  selector: 'app-bar-historic-settings',
  templateUrl: './bar-historic-settings.component.html',
  styleUrls: ['../app.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ]
})

export class BarHistoricSettingsComponent implements OnInit {

  public loading = false;
  public showChart: boolean;
  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;
  public tweets = [];

  public accounts: any;

  public maxDate = moment();

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Retweets' },
    { data: [], label: 'Likes' }
  ]

  public barChartLabels: Label[] = [];

  constructor(private snackBar: MatSnackBar, private apiService: ApiService) {
    this.apiService.getAccounts().subscribe(response => {
      this.accounts = response;
    });
    var filterData = JSON.parse(localStorage.getItem('historicFilters'));
    this.showChart = localStorage.getItem('showingHistoric') == 'true' ? true : false;
    if (filterData != null) {
      this.selectedWords = filterData.words;
      this.selectedAccounts = filterData.accounts;
      this.selectedDate = filterData.date != "null"? moment(filterData.date, "YYYY-MM-DD"): null;
      this.applyFilters();
    }
  }

  ngOnInit(): void {
  }

  addAccount(account: string) {
    if (!this.selectedAccounts.includes(account['screen_name'])) {
      this.selectedAccounts.push(account['screen_name']);
    }
  }

  removeAccount(account: string) {
    for (var i = 0; i < this.selectedAccounts.length; i++) {
      if (this.selectedAccounts[i] == account) {
        this.selectedAccounts.splice(i, 1);
      }
    }
  }

  addWord(word: string) {
    if (!this.selectedWords.includes(word)) {
      this.selectedWords.push(word);
    }
  }

  removeWord(word: string) {
    for (var i = 0; i < this.selectedWords.length; i++) {
      if (this.selectedWords[i] == word) {
        this.selectedWords.splice(i, 1);
      }
    }
  }

  setDate(event: MatDatepickerInputEvent<moment.Moment>) {
    this.selectedDate = event.value;
  }

  applyFilters() {
    var labels = [];
    var likes = [];
    var retweets = [];
    this.loading = true;
    this.apiService.getHistoricData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe(data => {
      this.tweets = data['tweets'];
      if(data['tweets'].length > 0) {
        data['data'].forEach(element => {
          labels.push(element['time'])
          likes.push(element['sum_like'])
          retweets.push(element['sum_rt'])
        });
        this.barChartLabels = labels;
        this.barChartData = [{ data: retweets, label: 'Retweets' }, { data: likes, label: 'Likes' }];
        
        localStorage.setItem('showingHistoric', "true");
        this.showChart = true;
        localStorage.setItem('historicFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));
      }
      else {
        localStorage.setItem('showingHistoric', 'false')
        this.showChart = false;
      }
      this.loading = false;
    });
  }

  updateData() {
    this.snackBar.open("Actualizando retweets y likes de hoy. Esto puede tardar unos segundos.", "Aceptar");
    this.apiService.updateTweets().subscribe(response => {
      this.applyFilters();
      this.snackBar.dismiss();
      this.snackBar.open("Retweets y likes de hoy actualizados.", "Aceptar")
    },
    error => {
      this.snackBar.open("Error de conexión", "Aceptar")
    });
  }
}
