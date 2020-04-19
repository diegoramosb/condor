import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css']
})
export class DashboardComponent implements OnInit {

  public showingHistoric = true;
  public showingBubbles = false;
  public showingGraph = false;
  public showingFreq = false;

  constructor() { }

  ngOnInit(): void {
  }

}
