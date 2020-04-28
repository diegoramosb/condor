import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { SettingsComponent } from '../settings/settings.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private snackBar: MatSnackBar, private apiService: ApiService, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.getAccounts().subscribe(response => console.log(response));
    this.bubbleWord = localStorage.getItem('bubbleWord');
    this.freqWord = localStorage.getItem('freqWord');
    this.historicWord = localStorage.getItem('historicWord');
  }

  extractTweets() {
    this.getAccounts().subscribe((response: string[]) => {
      let accounts: string[] = response
      this.apiService.extractTweets(accounts, Math.floor(200 / accounts.length)).subscribe(response => {
        this.snackBar.open(`Actualizados ${response['newTweets']} tweets`, "Aceptar");
      })
    });

  }

  getAccounts() {
    return this.apiService.getAccounts();
  }

  openSettings() {
    this.getAccounts().subscribe((response: []) => {
      let accounts: string[] = response
      const dialogRef = this.dialog.open(SettingsComponent, {
        width: '40vw',
        data: { name: accounts }
      });
  
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   this.accounts = result;
      // });
    })
  }
}