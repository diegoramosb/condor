import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { BaseChartDirective} from 'ng2-charts'

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['../app.component.css']
})
export class BubbleComponent implements OnInit, OnDestroy, OnChanges {

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Retweets"
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Likes"
        },
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';
          if(label) {
            label += " ";
          }
          var x = data.datasets[tooltipItem.datasetIndex].data[0]['x'];
          var y = data.datasets[tooltipItem.datasetIndex].data[0]['y'];
          var r = data.datasets[tooltipItem.datasetIndex].data[0]['z'];
          label += "retweets: " + x + ", likes: " + y + ", tweets: " + r;
          return label;
        }
      }
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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor() {
    console.log(this.chart)
  }

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

  ngOnChanges() {
    if(this.chart != undefined) {
      this.chart.chart.config.options.scales.xAxes[0].ticks.min = 0;
      this.chart.chart.config.options.scales.xAxes[0].ticks.max = this.maxX();
      this.chart.chart.config.options.scales.yAxes[0].ticks.max = 0;
      this.chart.chart.config.options.scales.yAxes[0].ticks.max = this.maxY();
    }
  }


  minX() {
    // var minX = Infinity;
    // var maxR = 0;
    // this.bubbleChartData.forEach(element => {
    //   var x = element['data']['0']['x']
    //   var r = element['data']['0']['r']
    //   if(r >= maxR) {
    //     maxR = r;
    //   }
    //   if(x <= minX) {
    //     minX = x;
    //   }
    // });
    // return minX - maxR;
    return 0;
  }

  maxX() {
    var maxX = 0;
    var maxR = 0;
    this.bubbleChartData.forEach(element => {
      var x = element['data']['0']['x']
      var r = element['data']['0']['z']
      if(r >= maxR) {
        maxR = r;
      }
      if(x >= maxX) {
        maxX = x;
      }
    });
    return (maxX + maxR);
  }

  minY() {
    // var minY = Infinity;
    // var maxR = 0;
    // this.bubbleChartData.forEach(element => {
    //   var x = element['data']['0']['y']
    //   var r = element['data']['0']['r']
    //   if(r >= maxR) {
    //     maxR = r;
    //   }
    //   if(x <= minY) {
    //     minY = x;
    //   }
    // });
    // return minY - maxR;
    return 0;
  }

  maxY() {
    var maxY = 0;
    var maxR = 0;
    this.bubbleChartData.forEach(element => {
      var x = element['data']['0']['y']
      var r = element['data']['0']['z']
      if(r >= maxR) {
        maxR = r;
      }
      if(x >= maxY) {
        maxY = x;
      }
    });
    return (maxY + maxR);
  }

}
