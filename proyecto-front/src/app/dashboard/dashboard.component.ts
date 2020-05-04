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

  public showingHistoric: boolean;
  public showingBubble: boolean;
  public showingGraph: boolean;
  public showingFreq: boolean;

  constructor(private snackBar: MatSnackBar, private apiService: ApiService, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.showingHistoric = localStorage.getItem('showingHistoric') == 'true'? true: false;
    this.showingBubble = localStorage.getItem('showingBubble') == 'true'? true: false;
    this.showingGraph = localStorage.getItem('showingGraph') == 'true'? true: false;
    this.showingFreq = localStorage.getItem('showingFreq') == 'true'? true: false;
  }

  extractTweets() {
    this.getAccounts().subscribe((response: string[]) => {
      let accounts: string[] = [];
      response.forEach(account => {
        accounts.push(account['screen_name'])
      });
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
        data: {accounts: accounts, newAccounts: [], removedAccounts: []}
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result != undefined) {
          result.removedAccounts.forEach((removedId: number) => {
            this.apiService.unsubscribeFromAccount(removedId);
          });
        }
      });
    })
  }
}