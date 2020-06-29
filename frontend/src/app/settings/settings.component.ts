import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounce, debounceTime, switchMap } from 'rxjs/operators';

export interface DialogData {
  accounts: User[];
  removedAccounts: User[];
  newAccounts: string[];
}

export interface User {
  _id: number;
  screen_name: string;
  name: string;
  profile_image: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../app.component.css']
})
export class SettingsComponent implements OnInit {

  usersForm: FormGroup;

  filteredUsers: User[];

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.usersForm = this.formBuilder.group({ userInput: null });

    this.usersForm
      .get('userInput')
      .valueChanges
      .pipe(
        switchMap(value => this.apiService.searchNewUser(value)
        )
      )
      .subscribe((users: User[]) => this.filteredUsers = users);
  }

  addAccount(account: User) {
    var contains1 = false;
    var contains2 = false;
    this.data.newAccounts.forEach(acc => {
      if (acc == account['screen_name']) {
        contains1 = true;
      }
    });
    this.data.accounts.forEach(acc => {
      if (acc["_id"] == account["_id"]) {
        contains2 = true;
      }
    });
    if ((contains1 && contains2) == false) {
      this.data.newAccounts.push(account['screen_name']);
      this.data.accounts.push(account);
    }
  }

  removeAccount(account: string) {
    for (var i = 0; i < this.data.accounts.length; i++) {
      if (this.data.accounts[i]['screen_name'] == account) {
        this.data.removedAccounts.push(this.data.accounts[i]);
        this.data.accounts.splice(i, 1);
      }
    }
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
