import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bar-historic',
  templateUrl: './bar-historic.component.html',
  styleUrls: ['../app.component.css']
})
export class BarHistoricComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Hora de consulta"
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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    {
      backgroundColor: "rgba(25, 207, 134, 0.5)",
      hoverBackgroundColor: "rgba(25, 207, 134, 1)"
    },
    {
      backgroundColor: "rgba(232, 28, 79, 0.5)",
      hoverBackgroundColor: "rgba(232, 28, 79, 1)"
    },
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Retweets' },
    { data: [], label: 'Likes' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  onEnter(word: string) {
    var labels = []; 
    var likes = [];
    var retweets = [];
    this.apiService.getHistoricData(word).subscribe((data: []) => {
      data.forEach(element => {
        labels.push(element['hour'])
        likes.push(element['numFavs'])
        retweets.push(element['numRts'])
      });
    });
    this.barChartLabels = labels;
    this.barChartData = [{data: retweets, label:'Retweets'}, {data: likes, label:'Likes'}];
  }
}
