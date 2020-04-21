import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css']
})
export class DashboardComponent implements OnInit {

  public historicWord: string;
  public bubbleWord: string;
  public showingGraph = false;
  public freqWord: string;
  public accounts = [];

  constructor(private snackBar: MatSnackBar, private apiService: ApiService) { }


  ngOnInit(): void {
    this.getAccounts();
    this.bubbleWord = localStorage.getItem('bubbleWord');
    this.freqWord = localStorage.getItem('freqWord');
    this.historicWord = localStorage.getItem('historicWord');
  }

  extractTweets() {
    this.apiService.extractTweets(this.accounts, Math.floor(200/this.accounts.length)).subscribe(response => {
      this.snackBar.open(`Actualizados ${response['newTweets']} tweets`, "Aceptar");
    })
  }

  addAccount(account: string) {
    if(!this.accounts.includes(account)){
      this.accounts.push(account);
    }
  }

  getAccounts() {
    this.apiService.getAccounts().subscribe((response: [])=> {
      this.accounts = response
    });
  }

}
