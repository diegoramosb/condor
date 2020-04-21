import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['../app.component.css']
})
export class TweetsComponent implements OnInit {

  tweets = []

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTweets()
  }

  getTweets() {
    this.apiService.getTweets().subscribe((response: []) => {
      this.tweets = response;
    })
  }

  getTweetsByWord(word: string) {
    console.log(word)
    this.apiService.getTweetsWord(word).subscribe((response: []) => {
      this.tweets = response;
      console.log(this.tweets);
    })
  }

}
