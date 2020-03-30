import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-bar-historic',
  templateUrl: './bar-historic.component.html',
  styleUrls: ['../app.component.css']
})
export class BarHistoricComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Hora de consulta"
        }
      }]
    }
  };
  public barChartLabels: Label[] = ['8:00', '10:00', '15:00'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    {
      backgroundColor: "rgba(25, 207, 134, 0.5)",
      hoverBackgroundColor: "rgba(25, 207, 134, 1)"
    },
    {
      backgroundColor: "rgba(232, 28, 79, 0.5)",
      hoverBackgroundColor: "rgba(232, 28, 79, 1)"
    },
  ];

  public barChartData: ChartDataSets[] = [
    { data: [65, 123, 286], label: 'Retweets' },
    { data: [121, 374, 562], label: 'Likes' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
