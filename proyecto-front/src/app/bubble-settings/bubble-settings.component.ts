import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../api.service';
import { ChartDataSets } from 'chart.js';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { thresholdFreedmanDiaconis } from 'd3';

@Component({
  selector: 'app-bubble-settings',
  templateUrl: './bubble-settings.component.html',
  styleUrls: ['../app.component.css']
})
export class BubbleSettingsComponent implements OnInit {

  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;

  public accounts: any;

  public maxDate = moment();

  public bubbleChartData: ChartDataSets[] = [

    { data: [], label: '' },
  ];

  public title: string;

  ngOnInit(): void {
  }

  constructor(private apiService: ApiService) {
    this.apiService.getAccounts().subscribe(response => {
      this.accounts = response;
    });
    var filterData = JSON.parse(localStorage.getItem('bubbleFilters'));
    if(filterData != null) {
      this.selectedWords = filterData.words;
      this.selectedAccounts = filterData.accounts;
      // this.selectedDate = moment
      this.setTitle();
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
    console.log(this.selectedDate);
    this.selectedDate = event.value;
  }

  applyFilters() {
    this.apiService.getBubbleChartData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe((data: []) => {
      console.log(data);
      var x: number;
      var info = [];
      var y: number;
      var r: number;
      data['bubbles'].forEach((element) => {
        x = (element['data']['x'])
        y = element['data']['y']
        r = element['data']['z']

        info.push({ data: [{ x: x, y: y, r: r }], label: element['label'] })
      });
      this.bubbleChartData = info

      localStorage.setItem('showingBubble', "true");
      localStorage.setItem('bubbleFilters', JSON.stringify({
        'words': this.selectedWords,
        'accounts': this.selectedAccounts
        // 'date': this.selectedDate != null ? { 'day': this.selectedDate.day(), 'month': this.selectedDate.month(), 'year': this.selectedDate.year() } : 'null'
      }));
      this.setTitle();
    });
  }

  setTitle() {
    this.title = `Likes, retweets y número de tweets con la(s) palabra(s) ${this.selectedWords}`
  }

}
