import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../api.service';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-bubble-settings',
  templateUrl: './bubble-settings.component.html',
  styleUrls: ['../app.component.css']
})
export class BubbleSettingsComponent implements OnInit {

  public selectedAccounts = [];

  public accounts = [];

  public selectedWords = [];

  public maxDate = moment();

  public word: string;

  public bubbleChartData: ChartDataSets[] = [

    { data: [], label: '' },
  ];

  ngOnInit(): void {
    this.word = localStorage.getItem('bubbleWord');
  }

  constructor(private apiService: ApiService) { }

  addAccount(account: string) {
    if (!this.selectedAccounts.includes(account)) {
      this.selectedAccounts.push(account);
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

  applyFilters(word: string) {
    this.word = word;
    this.apiService.getBubbleChartData(word).subscribe((data: []) => {
      var x: number;
      var info = [];
      var y: number;
      var r: number;
      data.forEach((element) => {
        x = (element['info']['data']['x'])
        y = element['info']['data']['y']
        r = element['info']['data']['z']

        info.push({ data: [{ x: x, y: y, r: r }], label: element['info']['label'] })
      });
      this.bubbleChartData = info
      localStorage.setItem('bubbleWord', word);
    });
  }

}
