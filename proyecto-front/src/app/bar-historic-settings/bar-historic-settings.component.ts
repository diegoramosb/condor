import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-bar-historic-settings',
  templateUrl: './bar-historic-settings.component.html',
  styleUrls: ['../app.component.css']
})
export class BarHistoricSettingsComponent implements OnInit {

  constructor() { }

  public accounts = ["a", "b", "c"]

  public selectedAccounts = [];

  public selectedWords = [];

  public maxDate = moment();
  
  ngOnInit(): void {
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

  addWord(word: string) {
    if(!this.selectedWords.includes(word)) {
      this.selectedWords.push(word);
    }
  }

  removeWord(word: string) {
    for(var i = 0; i < this.selectedWords.length; i++) {
      if(this.selectedWords[i] == word) {
        this.selectedWords.splice(i, 1);
      }
    }
  }

}
