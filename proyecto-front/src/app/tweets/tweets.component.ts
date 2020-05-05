import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['../app.component.css']
})
export class TweetsComponent implements OnInit {

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
      this.selectedDate = filterData.date != "null"? moment(filterData.date, "YYYY-MM-DD"): null;
      this.positive = filterData.positive;
      this.negative = filterData.negative;
      this.neutral = filterData.neutral;
      this.none = filterData.none;
      this.applyFilters();
    }
  }

  ngOnInit(): void {
    this.getTweets()
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


  getTweets() {
    this.apiService.getTweets().subscribe((response: []) => {
      this.tweets = response;
    })
  }

  applyFilters() {
    var selectedPolarities = [];
    if(this.positive) {
      selectedPolarities.push("positive")
    }
    if(this.negative) {
      selectedPolarities.push("negative")
    }
    if(this.neutral) {
      selectedPolarities.push("neutral")
    }
    if(this.none) {
      selectedPolarities.push("none")
    }
    this.apiService.getTweetsFilters(this.selectedWords, this.selectedAccounts, this.selectedDate, selectedPolarities).subscribe((response: []) => {
      this.tweets = response;
    });
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

  removeFilters() {
    this.selectedAccounts = [];
    this.selectedWords = [];
    this.selectedDate = null;
    this.positive = true;
    this.negative = true;
    this.neutral = true;
    this.none = true;
    this.getTweets();
  }

}
