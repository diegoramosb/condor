import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-bar-historic',
  templateUrl: './bar-historic.component.html',
  styleUrls: ['../app.component.css']
})
export class BarHistoricComponent implements OnInit, OnDestroy {

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
  
  @Input() barChartLabels: Label[];
  @Input() barChartData: ChartDataSets[];

  public text = "";
  public showing = false;

  constructor() { }

  ngOnInit() {
    var data = JSON.parse(localStorage.getItem('historicData'));
    if(data != null) {
      this.barChartData = data['historicData'];
      this.barChartLabels = data['historicLabels'];
    }
  }

  ngOnDestroy() {
    if(localStorage.getItem('showingHistoric') == 'true') {
      var json = {'historicData': this.barChartData, 'historicLabels': this.barChartLabels};
      localStorage.setItem('historicData', JSON.stringify(json));
    }
  }
}
