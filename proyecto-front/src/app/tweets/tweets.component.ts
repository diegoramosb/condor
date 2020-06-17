import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'D/M/YYYY'
  },
  display: {
    dateInput: 'D/M/YYYY'
  }
}

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
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

export class TweetsComponent implements OnInit {

  public showTweets = true;
  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;
  public tweets = [];
  public accounts: any;

  public maxDate = moment();
  positive = true;
  negative = true;
  neutral = true;
  none = true;


  constructor(private apiService: ApiService) {
    this.apiService.getAccounts().subscribe(response => {
      this.accounts = response;
    });
    var filterData = JSON.parse(localStorage.getItem('tweetFilters'));
    if (filterData != null) {
      this.selectedWords = filterData.words;
      this.selectedAccounts = filterData.accounts;
      this.selectedDate = filterData.date != "null" ? moment(filterData.date, "YYYY-MM-DD") : null;
      this.positive = filterData.positive;
      this.negative = filterData.negative;
      this.neutral = filterData.neutral;
      this.none = filterData.none;
      this.applyFilters();
    }
    else {
      this.getTweets();
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

  setPolarity(tweetId: string, polarity: string) {
    this.apiService.setPolarity(tweetId, polarity).subscribe(response => {
      if (localStorage.getItem('tweetFilters') != null) {
        this.applyFilters();
      }
      else {
        this.getTweets();
      }
    });
  }

  getTweets() {
    this.apiService.getTweets().subscribe((response: []) => {
      if (response.length > 0) {
        this.tweets = response;
      }
      else {
        this.showTweets = false;
      }
    })
  }

  applyFilters() {
    var selectedPolarities = [];
    if (this.positive) {
      selectedPolarities.push("P")
    }
    if (this.negative) {
      selectedPolarities.push("N")
    }
    if (this.neutral) {
      selectedPolarities.push("NEU")
    }
    if (this.none) {
      selectedPolarities.push("NONE")
    }
    this.apiService.getTweetsFilters(this.selectedWords, this.selectedAccounts, this.selectedDate, selectedPolarities).subscribe((response: []) => {
      if (response.length > 0) {
        this.tweets = response;
        this.showTweets = true;
        localStorage.setItem('tweetFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null',
          'positive': this.positive,
          'negative': this.negative,
          'neutral': this.neutral,
          'none': this.none,
        }));
      }
      else {
        this.showTweets = false;
      }
    });
  }

  removeFilters() {
    this.selectedAccounts = [];
    this.selectedWords = [];
    this.selectedDate = null;
    this.positive = true;
    this.negative = true;
    this.neutral = true;
    this.none = true;
    localStorage.removeItem('tweetFilters');
    this.getTweets();
  }

}
