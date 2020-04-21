import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css']
})
export class DashboardComponent implements OnInit {

  public showingHistoric = true;
  public showingBubble = true;
  public showingGraph = true;
  public showingFreq = true;

  public accounts = [];

  constructor(private snackBar: MatSnackBar, private apiService: ApiService) { }


  ngOnInit(): void {

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

}
