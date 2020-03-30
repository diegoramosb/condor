import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['../app.component.css']
})
export class BubbleComponent implements OnInit {

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Retweets"
        },
        ticks: {
          min: 0,
          max: 50,
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Likes"
        },
        ticks: {
          min: 0,
          max: 200,
        }
      }]
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;
  public barChartColors: Color[] = [
    {
      backgroundColor: "rgba(29, 161, 243, 0.5)",
      hoverBackgroundColor: "rgba(29, 161, 243, 1)"
    },
    {
      backgroundColor: "rgba(25, 207, 134, 0.5)",
      hoverBackgroundColor: "rgba(25, 207, 134, 1)"
    },
    {
      backgroundColor: "rgba(232, 28, 79, 0.5)",
      hoverBackgroundColor: "rgba(232, 28, 79, 1)"
    },
  ];

  public bubbleChartData: ChartDataSets[] = [
    {
      data: [
        { x: 50, y: 123, r: 10 },
      ],
      label: 'Cuenta1',
    },
    {
      data: [
        { x: 15, y: 89, r: 5 },
      ],
      label: 'Cuenta2',
    },
    {
      data: [
        { x: 24, y: 150, r: 16 },
      ],
      label: 'Cuenta3',
    },
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getBubbleData()
  }

}
