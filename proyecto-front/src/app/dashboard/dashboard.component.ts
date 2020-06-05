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

  graphHeight = (window.innerHeight * 64) / 100;

  graphWidth = (window.innerWidth * 32) / 100;

  constructor(private snackBar: MatSnackBar, private apiService: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showingHistoric = localStorage.getItem('showingHistoric') == 'true' ? true : false;
    this.showingBubble = localStorage.getItem('showingBubble') == 'true' ? true : false;
    this.showingGraph = localStorage.getItem('showingGraph') == 'true' ? true : false;
    this.showingFreq = localStorage.getItem('showingFreq') == 'true' ? true : false;
    this.apiService.automaticTweets().subscribe();
  }

  getAccounts() {
    return this.apiService.getAccounts();
  }

  openSettings() {
    this.getAccounts().subscribe((response: []) => {
      let accounts: string[] = response
      const dialogRef = this.dialog.open(SettingsComponent, {
        width: '40vw',
        data: { accounts: accounts, newAccounts: [], removedAccounts: [] }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          result.removedAccounts.forEach((removedId: number) => {
            this.apiService.unsubscribeFromAccount(removedId).subscribe(response => {
              this.snackBar.open("Eliminados tweets de las cuentas seleccionadas", "Aceptar")
            }
            );
          });
          if (result.newAccounts.length > 0) {
            this.snackBar.open("Descargando tweets de las nuevas cuentas. Esto puede tardar unos segundos.", "Aceptar");
            this.apiService.extractTweets(result.newAccounts).subscribe(response => {
              this.snackBar.dismiss()
              this.snackBar.open(`Descargados ${response['newTweets']} tweets de las nuevas cuentas`, "Aceptar");
            });
          }
        }
      });
    })
  }
}