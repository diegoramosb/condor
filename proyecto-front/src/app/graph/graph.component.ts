import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['../app.component.css']
})
export class GraphComponent implements OnInit {

  public barChartColors: Color[] = [
    {
      backgroundColor: "rgba(29, 161, 243, 1)"
    },
    {
      backgroundColor: "rgba(25, 207, 134, 1)"
    },
    {
      backgroundColor: "rgba(232, 28, 79, 1)"
    },
    {
      backgroundColor: "rgba(250, 28, 79, 1)"
    }
  ];

  public scatterChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    tooltips: {
      intersect: false,
      mode: "nearest"
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: 20,
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: 20,
          display: false
        }
      }]
    }
  };

  public scatterChartData: ChartDataSets[] = [
    { data: [] }
    // {
    //   data: [
    //     { x: 10, y: 5, r: 10 },
    //   ],
    //   label: 'Cuenta1',
    //   backgroundColor: "rgba(29, 161, 243, 1)",
    //   type: 'bubble'
    // },
    // {
    //   data: [
    //     { x: 20, y: 3, r: 10 },
    //   ],
    //   label: 'Cuenta2',
    //   backgroundColor: "rgba(25, 207, 134, 1)",
    //   type: 'bubble'
    // },
    // {
    //   data: [
    //     { x: 30, y: 7, r: 10 },
    //   ],
    //   label: 'Cuenta3',
    //   backgroundColor: "rgba(232, 28, 79, 1)",
    //   type: 'bubble'
    // },
    // {
    //   data: [{ x: 10, y: 5 }, { x: 20, y: 3 }],
    //   label: 'Palabra1',
    //   type: 'line',
    //   fill: false,
    //   borderColor: "grey",
    //   pointBackgroundColor: "rgba(0, 0, 0, 0)",
    //   pointRadius: 0
    // },
    // {
    //   data: [{ x: 20, y: 3 }, { x: 30, y: 7 }],
    //   label: 'Palabra2',
    //   type: 'line',
    //   fill: false,
    //   borderColor: "grey",
    //   pointBackgroundColor: "rgba(0, 0, 0, 0)",
    //   pointRadius: 0
    // },
  ];
  public scatterChartType: ChartType = 'bubble';

  public words: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  onEnter(word: string) {
    this.words.push(word)
    this.getWords(this.words);
  }

  wordGroup() {
    var group = [];
    for (var i = 0, j = 0; i < this.words.length; i++) {
      if (i >= 2 && i % 2 == 0) {
        j++
      }
      group[j] = group[j] || [];
      group[j].push(this.words[i])
    }
    return group;
  }

  getWords(words: string[]) {

    this.apiService.getGraphData(words).subscribe((result: []) => {
      var graph = []
      var i = 0;
      result['nodes'].forEach(node => {
        graph.push({
          data: [
            { x: node['x'], y: node['y'], r: 10 }
          ],
          label: node['cuenta'],
          type: 'bubble',
          backgroundColor: this.barChartColors[i]
        })
        i++;
      });
      result['links'].forEach(link => {
        graph.push({
          data: [
            { x: link['origen']['x'], y: link['origen']['y'] },
            { x: link['destino']['x'], y: link['destino']['y'] },
          ],
          label: link['palabra'],
          pointRadius: 0,
          type: "line",
          fill: false,
          borderColor: "grey"
        })
      })

      this.scatterChartData = graph;
      console.log(graph);
    });
  }

}
