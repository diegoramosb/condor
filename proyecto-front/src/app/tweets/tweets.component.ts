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

  public visualizeCount = 4;
  public loading: boolean;
  public showTweets = true;
  public selectedAccounts = [];
  public selectedWords = [];
  public selectedDate = null;
  public tweets = [];
  public accounts = [];

  public maxDate = moment();
  positive = true;
  negative = true;
  neutral = true;
  none = true;


  constructor(private apiService: ApiService) {
    this.apiService.getAccounts().subscribe((response: []) => {
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
    this.loading = true;
    this.apiService.getTweets().subscribe((response: []) => {
      if (response.length > 0) {
        this.tweets = response;
      }
      else {
        this.showTweets = false;
      }
      this.loading = false;
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
    this.loading = true;
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
      this.loading = false;
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

  visualize() {
    this.visualizeHistoric()
    this.visualizeBubbles()
    this.visualizeGraph()
    this.visualizeFreq()
  }

  visualizeHistoric() {
    this.visualizeCount--;
    var labels = [];
    var likes = [];
    var retweets = [];
    this.apiService.getHistoricData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe(data => {
      if(data['tweets'].length > 0) {
        data['data'].forEach(element => {
          labels.push(element['time'])
          likes.push(element['sum_like'])
          retweets.push(element['sum_rt'])
        });
        var barChartData = [{ data: retweets, label: 'Retweets' }, { data: likes, label: 'Likes' }];
        
        localStorage.setItem('showingHistoric', "true");
        localStorage.setItem('historicFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));

        var json = {'historicData': barChartData, 'historicLabels': labels};
        localStorage.setItem('historicData', JSON.stringify(json));
      }
      else {
        localStorage.setItem('showingHistoric', 'false')
      }
      this.visualizeCount++;
    });
  }

  visualizeBubbles() {
    this.visualizeCount--;
    this.apiService.getBubbleChartData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe(data => {
      if (data['tweets'].length > 0) {
        var info = [];
        var x: number;
        var y: number;
        var r: number;
        var z: number;
        data['bubbles'].forEach((element) => {
          x = element['data']['x'];
          y = element['data']['y'];
          r = element['data']['w'];
          z = element['data']['z']

          info.push({ data: [{ x: x, y: y, r: r, z: z }], label: element['label'] });
        });
        localStorage.setItem('showingBubble', "true");
        localStorage.setItem('bubbleFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));

        var json = {'bubbleData': info};
        localStorage.setItem('bubbleData', JSON.stringify(json));
      }
      else {
        localStorage.setItem('showingBubble', 'false')
      }
      this.visualizeCount++;
    });
  }

  visualizeGraph() {
    if(this.selectedAccounts.length != 1) {
      this.visualizeCount--;
      this.apiService.getGraphData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe(data => {
        if (data['tweets'].length > 0) {
          var graphData = data['data'];
          localStorage.setItem('showingGraph', "true");
          localStorage.setItem('graphFilters', JSON.stringify({
            'words': this.selectedWords,
            'accounts': this.selectedAccounts,
            'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
          }));
  
          var json = {'graphData': graphData};
          localStorage.setItem('graphData', JSON.stringify(json));
        }
        else {
          localStorage.setItem('showingGraph', 'false');
        }
      });
      this.visualizeCount++;
    }
    else {
      localStorage.removeItem('graphData');
      localStorage.removeItem('graphFilters')
    }
  }

  visualizeFreq() {
    var words = [];
    var count = [];
    this.visualizeCount--;
    this.apiService.getFrecuencyChartData(this.selectedWords, this.selectedAccounts, this.selectedDate).subscribe((data: []) => {
      if(data['tweets'].length > 0) {
        data['data'].forEach(element => {
          words.push(element['_id'])
          count.push(element['count'])
        });
        var freqChartLabels = words;
        var freqChartData = [{ data: count, label: 'Frecuencia' }];
        localStorage.setItem('showingFreq', "true");
        localStorage.setItem('freqFilters', JSON.stringify({
          'words': this.selectedWords,
          'accounts': this.selectedAccounts,
          'date': this.selectedDate != null ? this.selectedDate.format('YYYY-MM-DD') : 'null'
        }));

        var json = {'freqChartData': freqChartData, 'freqChartLabels': freqChartLabels};
        localStorage.setItem('freqData', JSON.stringify(json));
      }
      else { 
        localStorage.setItem('showingFreq', 'false')
      }
      this.visualizeCount++;
    });
  }
}
