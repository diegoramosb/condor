import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {ApiService} from "../api.service";
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'app-word-freq-settings',
  templateUrl: './word-freq-settings.component.html',
  styleUrls: ['../app.component.css']
})
export class WordFreqSettingsComponent implements OnInit {

  public accounts = ["a", "b", "c"]

  public selectedAccounts = [];

  public word: string;

  public words = [];

  public maxDate = moment();

  public count = []; 

  public freqChartData: ChartDataSets[] = [
    { data: [], label: 'Frecuencia' },
  ];

  public freqChartLabels: Label[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.word = localStorage.getItem('freqWord');
  }

  addAccount(account: string) {
    if(!this.selectedAccounts.includes(account)){
      this.selectedAccounts.push(account);
    }
  }

  removeAccount(account: string) {
    for(var i = 0; i < this.selectedAccounts.length; i++) {
      if(this.selectedAccounts[i] == account) {
        this.selectedAccounts.splice(i, 1);
      }
    }
  }

  asdf(){}

  applyFilters(word: string) {
    this.words = [];
    this.count = [];
    this.word = word;
     this.apiService.getFrecuencyChartData(this.word).subscribe((data: []) => {
       data.forEach(element => {
           this.words.push(element['_id'])
           this.count.push(element['count'])
       });
       this.freqChartLabels = this.words;
       this.freqChartData = [{data: this.count, label:'Frecuencia'}];
       localStorage.setItem('freqWord', this.word);
     });
   }

}
