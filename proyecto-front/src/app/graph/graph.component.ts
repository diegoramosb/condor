import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['../app.component.css']
})
export class GraphComponent implements OnInit {

  public scatterChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    tooltips: {
      intersect: false,
      mode: "nearest"
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: 50,
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: 10,
          display: false
        }
      }]
    }
  };

  public scatterChartData: ChartDataSets[] = [
    {
      data: [
        { x: 10, y: 5, r: 10 },
      ],
      label: 'Cuenta1',
      backgroundColor: "rgba(29, 161, 243, 1)",
      type: 'bubble'
    },
    {
      data: [
        { x: 20, y: 3, r: 10 },
      ],
      label: 'Cuenta2',
      backgroundColor: "rgba(25, 207, 134, 1)",
      type: 'bubble'
    },
    {
      data: [
        { x: 30, y: 7, r: 10 },
      ],
      label: 'Cuenta3',
      backgroundColor: "rgba(232, 28, 79, 1)",
      type: 'bubble'
    },
    {
      data: [{x: 10, y: 5}, {x: 20, y: 3}],
      label: 'Palabra1',
      type: 'line',
      fill: false,
      borderColor: "grey",
      pointBackgroundColor: "rgba(0, 0, 0, 0)",
      pointRadius: 0
    },
    {
      data: [{x: 20, y: 3}, {x: 30, y: 7}],
      label: 'Palabra2',
      type: 'line',
      fill: false,
      borderColor: "grey",
      pointBackgroundColor: "rgba(0, 0, 0, 0)",
      pointRadius: 0
    },
  ];
  public scatterChartType: ChartType = 'bubble';

  constructor() { }

  ngOnInit() {
  }

}
