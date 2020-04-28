import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData{
  accounts: [];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../app.component.css']
})
export class SettingsComponent implements OnInit {

  public accounts = [];

  constructor(private apiService: ApiService, 
    public dialogRef: MatDialogRef<SettingsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  addAccount(account: string) {
    if (!this.accounts.includes(account)) {
      this.accounts.push(account);
    }
  }

  removeAccount(account: string) {
    for(var i = 0; i < this.accounts.length; i++) {
      if(this.accounts[i] == account) {
        this.accounts.splice(i, 1);
      }
    }
  }

  getAccounts() {
    this.apiService.getAccounts().subscribe((response: []) => {
      this.accounts = response
    });
  }

  onClickSave() {
    //service to remove from backend
    console.log("asdf")
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
