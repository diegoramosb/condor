import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChartDataSets } from 'chart.js';
import { ApiService } from '../api.service';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-historic-settings',
  templateUrl: './bar-historic-settings.component.html',
  styleUrls: ['../app.component.css']
})
export class BarHistoricSettingsComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  public accounts = ["a", "b", "c"]

  public selectedAccounts = [];

  public selectedWords = [];

  public maxDate = moment();

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Retweets' },
    { data: [], label: 'Likes' }
  ]

  public barChartLabels: Label[] = [];

  public word: string;

  ngOnInit(): void {
    this.word = localStorage.getItem('historicWord');
  }

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
    var labels = [];
    var likes = [];
    var retweets = [];
    this.apiService.getHistoricData(word).subscribe((data: []) => {
      // this.text = data['text'];
      data['hist'].forEach(element => {
        labels.push(element['hour'])
        likes.push(element['numFavs'])
        retweets.push(element['numRts'])
      });
    });
    this.barChartLabels = labels;
    this.barChartData = [{ data: retweets, label: 'Retweets' }, { data: likes, label: 'Likes' }];
    localStorage.setItem('historicWord', word);
  }

  updateData() {
    this.apiService.updateTweets().subscribe(response => {
      this.applyFilters(this.word);
    });
  }

  asdf(){}
}
