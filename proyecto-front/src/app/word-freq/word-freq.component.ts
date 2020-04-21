import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-word-freq',
  templateUrl: './word-freq.component.html',
  styleUrls: ['../app.component.css']
})
export class WordFreqComponent implements OnInit {

  public freqChartOptions: ChartOptions = {
    responsive: true,
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

      }],
      yAxes: [
        {
          ticks: {
            min: 0
          }
        }
      ]
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
  public height: string;


  mySubscription: any;

  @Input() freqChartData: ChartDataSets[];

  @Input() freqChartLabels: [];

  // public freqChartData: ChartDataSets[] = [

  //   { data: [], label: 'Frecuencia' },
  // ];

  constructor() {
  }

  ngOnInit() {
    this.getHeigth()
  }

  getHeigth() {
    if(this.freqChartLabels.length == 0) {
      this.height = "400"
    }
    else {
      this.height = (this.freqChartLabels.length * 5).toString()
    }
  }

}
