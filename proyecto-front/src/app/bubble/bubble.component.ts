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



    // {
    //   backgroundColor: "rgba(12,192,170,0.5)",
    //   hoverBackgroundColor: "rgba(12,192,170,1)"
    // },
    // {
    //   backgroundColor: "rgba(76,49,158,0.5)",
    //   hoverBackgroundColor: "rgba(76,49,158,1)"
    // },
    // {
    //   //amarillo
    //   backgroundColor: "rgba(252,209,7,0.5)",
    //   hoverBackgroundColor: "rgba(252,209,7,1)"
    // },
    // {
    //   //rosado
    //   backgroundColor: "rgba(251,84,113,0.5)",
    //   hoverBackgroundColor: "rgba(251,84,113,1)"
    // },
    // {
    //   //naranja
    //   backgroundColor: "rgba(240,102,20,0.5)",
    //   hoverBackgroundColor: "rgba(240,102,20,1)"
    // },
    // {
    //   backgroundColor: "rgba(175,211,90,0.5)",
    //   hoverBackgroundColor: "rgba(175,211,90,1)"
    // },
    // {
    //   backgroundColor: "rgba(40,78,55,0.5)",
    //   hoverBackgroundColor: "rgba(40,78,55,1)"
    // },
    // {
    //   backgroundColor: "rgba(135,206,254,0.5)",
    //   hoverBackgroundColor: "rgba(135,206,254,1)"
    // },
    // {
    //   backgroundColor: "rgba(140,2,80,0.5)",
    //   hoverBackgroundColor: "rgba(140,2,80,1)"
    // },
    // {
    //   backgroundColor: "rgba(85,241,123,0.5)",
    //   hoverBackgroundColor: "rgba(85,241,123,1)"
    // },
    // {
    //   //azul
    //   backgroundColor: "rgba(42,95,160,0.5)",
    //   hoverBackgroundColor: "rgba(42,95,160,1)"
    // },
    // {
    //   backgroundColor: "rgba(220,68,185,0.5)",
    //   hoverBackgroundColor: "rgba(220,68,185,1)"
    // },
    // {
    //   backgroundColor: "rgba(28,152,32,0.5)",
    //   hoverBackgroundColor: "rgba(28,152,32,1)"
    // },
    // {
    //   backgroundColor: "rgba(184,120,207,0.5)",
    //   hoverBackgroundColor: "rgba(184,120,207,1)"
    // },
    // {
    //   backgroundColor: "rgba(238,200,241,0.5)",
    //   hoverBackgroundColor: "rgba(238,200,241,1)"
    // },
    // {
    //   backgroundColor: "rgba(39,15,226,0.5)",
    //   hoverBackgroundColor: "rgba(39,15,226,1)"
    // },
    // {
    //   backgroundColor: "rgba(112,142,48,0.5)",
    //   hoverBackgroundColor: "rgba(112,142,48,1)"
    // },
    // {
    //   backgroundColor: "rgba(164,20,21,0.5)",
    //   hoverBackgroundColor: "rgba(164,20,21,1)"
    // },
    // {
    //   backgroundColor: "rgba(241,169,112,0.5)",
    //   hoverBackgroundColor: "rgba(241,169,112,1)"
    // },
    // {
    //   backgroundColor: "rgba(123,68,25,0.5)",
    //   hoverBackgroundColor: "rgba(123,68,25,1)"
    // }
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
      this.chart.chart.config.options.scales.yAxes[0].ticks.max = 0;
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
    return (maxX + maxR);
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
