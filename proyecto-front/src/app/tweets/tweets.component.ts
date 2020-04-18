import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['../app.component.css']
})
export class TweetsComponent implements OnInit {

  tweets = ["a", "s", "d", "f"]

  constructor() { }

  ngOnInit(): void {
  }

}
