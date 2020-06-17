import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ApiService } from '../api.service';
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
  selector: 'app-graph-settings',
  templateUrl: './graph-settings.component.html',
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

export class GraphSettingsComponent implements OnInit {

  public showChart: boolean;
  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;
  public tweets = [];

  public accounts: any;

  public maxDate = moment();

  public graphData = [];

  graphHeight = (window.innerHeight * 100) / 100;

  graphWidth = (window.innerWidth * 70) / 100;

  ngOnInit(): void {
  }

  constructor(private apiService: ApiService) {
    this.apiService.getAccounts().subscribe(response => {
      this.accounts = response;
    });
    var filterData = JSON.parse(localStorage.getItem('graphFilters'));
    this.showChart = localStorage.getItem('showingGraph') == 'true' ? true : false;
    if (filterData != null) {
      this.selectedWords = filterData.words;
      this.selectedAccounts = filterData.accounts;
      this.selectedDate = filterData.date != "null" ? moment(filterData.date, "YYYY-MM-DD") : null;
      this.applyFilters();
    }
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
    this.apiService.getGraphData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe(data => {
      this.tweets = data['tweets'];
      if (data['tweets'].length > 0) {
        this.graphData = data['data'];
        this.showChart = true;
        localStorage.setItem('showingGraph', "true");
        localStorage.setItem('graphFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));
      }
      else {
        localStorage.setItem('showingGraph', 'false')
        this.showChart = false;
      }
    });
  }
}
