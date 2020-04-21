import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
