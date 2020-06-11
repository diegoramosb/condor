import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['../app.component.css']
})
export class BubbleComponent implements OnInit, OnDestroy {

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

  public showing = false;

  @Input() bubbleChartData: ChartDataSets[];

  ngOnInit() {
    var data = JSON.parse(localStorage.getItem('bubbleData'));
    if (data != null) {
      this.bubbleChartData = data['bubbleData'];
    }
  }

  ngOnDestroy() {
    if (localStorage.getItem('showingBubble') == 'true') {
      var json = {'bubbleData': this.bubbleChartData};
      localStorage.setItem('bubbleData', JSON.stringify(json));
    }
  }
}
