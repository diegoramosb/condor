import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from "../api.service";
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  selector: 'app-word-freq-settings',
  templateUrl: './word-freq-settings.component.html',
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

export class WordFreqSettingsComponent implements OnInit {

  public showChart: boolean;
  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;
  public tweets = [];

  public accounts: any;

  public maxDate = moment();

  public freqChartData: ChartDataSets[] = [
    { data: [], label: 'Frecuencia' },
  ];

  public freqChartLabels: Label[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.getAccounts().subscribe(response => {
      this.accounts = response;
    });
    var filterData = JSON.parse(localStorage.getItem('freqFilters'));
    this.showChart = localStorage.getItem('showingFreq') == 'true' ? true : false;
    if (filterData != null) {
      this.selectedWords = filterData.words;
      this.selectedAccounts = filterData.accounts;
      this.selectedDate = filterData.date != "null" ? moment(filterData.date, "YYYY-MM-DD") : null;
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
    var words = [];
    var count = [];
    this.apiService.getFrecuencyChartData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe((data: []) => {
      if(data['data'].length > 0) {
        this.tweets = data['tweets'];
  
        data['data'].forEach(element => {
          words.push(element['_id'])
          count.push(element['count'])
        });
        this.freqChartLabels = words;
        this.freqChartData = [{ data: count, label: 'Frecuencia' }];
        this.showChart = true;
        localStorage.setItem('showingFreq', "true");
        localStorage.setItem('freqFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));
      }
      else { 
        localStorage.setItem('showingHistoric', 'false')
        this.showChart = false;
      }
    });
  }
}
