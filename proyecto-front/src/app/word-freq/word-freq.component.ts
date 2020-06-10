import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-word-freq',
  templateUrl: './word-freq.component.html',
  styleUrls: ['../app.component.css']
})
export class WordFreqComponent implements OnInit, OnDestroy {

  getHeight() {
    return this.freqChartData[0].data.length * 30;
  }

  public freqChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Frecuencia"
        },
        ticks: {
          min: 0,
        }
      }]
    }
  };
  public showing = false;
  // public freqChartLabels: Label[] = [];
  public freqChartType: ChartType = 'horizontalBar';
  public freqChartLegend = true;
  public freqChartPlugins = [];
  public freqChartColors: Color[] = [
    {
      backgroundColor: "rgba(29, 161, 243, 0.5)",
      hoverBackgroundColor: "rgba(29, 161, 243, 1)"
    }
  ];
  @Input() freqChartData: ChartDataSets[];

  @Input() freqChartLabels: [];

  constructor() {
    
  }

  ngOnInit() {
    var data = JSON.parse(localStorage.getItem('freqData'));
    if(data != null) {
      this.freqChartData = data['freqChartData'];
      this.freqChartLabels = data['freqChartLabels'];
    }
    
  }

  ngOnDestroy() {
    if(localStorage.getItem('showingFreq') == 'true') {
      var json = {'freqChartData': this.freqChartData, 'freqChartLabels': this.freqChartLabels};
      localStorage.setItem('freqData', JSON.stringify(json));
    }
  }

  
}
