import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 30,
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 30,
        }
      }]
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;

  public bubbleChartData: ChartDataSets[] = [
    {
      data: [
        { x: 20, y: 10, r: 15 },
      ],
      label: 'Nombre 1',
    },
    {
      data: [
        { x: 10, y: 16, r: 10 },
      ],
      label: 'Nombre 2',
    },
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getBubbleData().subscribe((res) => {
      console.log(res)
    })
  }

}
