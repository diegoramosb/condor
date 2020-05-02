import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData{
  accounts: [];
  removedAccounts: number[];
  newAccounts: string[];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../app.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private apiService: ApiService, 
    public dialogRef: MatDialogRef<SettingsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    // this.data.accounts.forEach(account => {
    //   this.accountsStr.push(account['screen_name']);
    // });
  }

  addAccount(account: string) {
    var contains = false;
    this.data.accounts.forEach(acc => {
      if(acc['screen_name'] == account) {
        contains = true;
      }
    });
    if(!contains) {
      //getAccountAPI
      this.data.newAccounts.push(account);
    }
  }

  removeAccount(account: string) {
    for(var i = 0; i < this.data.accounts.length; i++) {
      if(this.data.accounts[i]['screen_name'] == account) {
        this.data.removedAccounts.push(this.data.accounts[i]['_id']);
        this.data.accounts.splice(i, 1);
        console.log(account)
      }
    }
  }

  // onClickSave() {
  //   this.removedAccounts;
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
