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
      backgroundColor: "rgba(255,30,211,0.5)",
      hoverBackgroundColor: "rgba(255,30,211,1)"
    },
    {
      backgroundColor: "rgba(178,0,22,0.5)",
      hoverBackgroundColor: "rgba(178,0,22,1)"
    },
    {
      backgroundColor: "rgba(151,210,0,0.5)",
      hoverBackgroundColor: "rgba(151,210,0,1)"
    },
    {
      backgroundColor: "rgba(95,56,202,0.5)",
      hoverBackgroundColor: "rgba(95,56,202,1)"
    },
    {
      backgroundColor: "rgba(249,179,0,0.5)",
      hoverBackgroundColor: "rgba(249,179,0,1)"
    },
    {
      backgroundColor: "rgba(98,0,126,0.5)",
      hoverBackgroundColor: "rgba(98,0,126,1)"
    },
    {
      backgroundColor: "rgba(0,190,93,0.5)",
      hoverBackgroundColor: "rgba(0,190,93,1)"
    },
    {
      backgroundColor: "rgba(193,78,215,0.5)",
      hoverBackgroundColor: "rgba(193,78,215,1)"
    },
    {
      backgroundColor: "rgba(119,115,0,0.5)",
      hoverBackgroundColor: "rgba(19,115,0,1)"
    },
    {
      backgroundColor: "rgba(206,129,201,0.5)",
      hoverBackgroundColor: "rgba(206,129,201,1)"
    },
    {
      backgroundColor: "rgba(137,207,165,0.5)",
      hoverBackgroundColor: "rgba(137,207,165,1)"
    },
    {
      backgroundColor: "rgba(1,208,226,0.5)",
      hoverBackgroundColor: "rgba(1,208,226,1)"
    },
    {
      //café
      backgroundColor: "rgba(108,42,10,0.5)",
      hoverBackgroundColor: "rgba(108,42,10,1)"
    },
    {
      backgroundColor: "rgba(192,73,110,0.5)",
      hoverBackgroundColor: "rgba(192,73,110,1)"
    },
    {
      backgroundColor: "rgba(1,131,190,0.5)",
      hoverBackgroundColor: "rgba(1,131,190,1)"
    },
    {
      backgroundColor: "rgba(240,208,141,0.5)",
      hoverBackgroundColor: "rgba(240,208,141,1)"
    },
    {
      backgroundColor: "rgba(75,48,80,0.5)",
      hoverBackgroundColor: "rgba(75,48,80,1)"
    },
    {
      backgroundColor: "rgba(173,166,193,0.5)",
      hoverBackgroundColor: "rgba(173,166,193,1)"
    },
    {
      backgroundColor: "rgba(47,93,110,0.5)",
      hoverBackgroundColor: "rgba(47,93,110,1)"
    },
    {
      backgroundColor: "rgba(0,255,255,0.5)",
      hoverBackgroundColor: "rgba(0,255,255,1)"
    }
  ];

  public showing = false;

  @Input() bubbleChartData: ChartDataSets[];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective; 

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
      this.chart.chart.config.options.scales.yAxes[0].ticks.min = 0;
      this.chart.chart.config.options.scales.yAxes[0].ticks.max = this.maxY();
    }
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
    return Math.ceil((maxX + maxR) * 1.1);
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
    return Math.ceil((maxY + maxR) * 1.1);
  }

}
