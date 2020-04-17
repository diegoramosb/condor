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

        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Likes"
        },
        ticks: {
          min: 0,

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

     { data: [], label: ''},
  ];

  public showing = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // this.apiService.getBubbleData()
  }

  onEnter(word: string) {

    this.apiService.getBubbleChartData(word).subscribe((data: []) => {
        var x:number;
        var info = [];
        var y:number;
        var r:number;
      data.forEach((element) => {

        x=(element['data']['x'])
        y=element['data']['y']
        r=element['data']['z']

        info.push({data:[{x:x, y:y, r:r}], label:element['label']})

      });

      this.bubbleChartData = info
      console.log(info)
    });


  }

}
