import { Component, OnInit } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-graph-card',
  templateUrl: './graph-card.component.html',
  styleUrls: ['./graph-card.component.css']
})
export class GraphCardComponent implements OnInit {
  public showing = true;
  public title = "asdf";


  constructor() { }

  ngOnInit(): void {
  }

}
