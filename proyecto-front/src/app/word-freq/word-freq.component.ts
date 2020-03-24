import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-word-freq',
  templateUrl: './word-freq.component.html',
  styleUrls: ['../app.component.css']
})
export class WordFreqComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    
  };
  public barChartLabels: Label[] = ['Palabra1', 'Palabra2', 'Palabra3', 'Palabra4', 'Palabra5', 'Palabra6', 'Palabra7'];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    {
      backgroundColor: "rgba(29, 161, 243, 0.5)",
      hoverBackgroundColor: "rgba(29, 161, 243, 1)"
    }
  ];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40, 10], 
      label: "Frecuencia"}
  ];

  constructor() { }

  ngOnInit() {
  }

}
