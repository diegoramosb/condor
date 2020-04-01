import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import {ApiService} from "../api.service";

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
  public freqChartLabels: Label[] = [];
  public freqChartType: ChartType = 'horizontalBar';
  public freqChartLegend = true;
  public freqChartPlugins = [];
  public freqChartColors: Color[] = [
    {
      backgroundColor: "rgba(29, 161, 243, 0.5)",
      hoverBackgroundColor: "rgba(29, 161, 243, 1)"
    }
  ];

  public freqChartData: ChartDataSets[] = [

    { data: [], label: 'Frecuencia' },
  ];

   constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  onEnter(word: string) {
     var palabras = [];
     var count = [];

      this.apiService.getFrecuencyChartData(word).subscribe((data: []) => {
        data.forEach(element => {
          palabras.push(element['_id'])
          count.push(element['count'])

        });
      });
      this.freqChartLabels = palabras;
      console.log(palabras)
      console.log(count)
      this.freqChartData = [{data: count, label:'Frecuencia'}];
    }
}
