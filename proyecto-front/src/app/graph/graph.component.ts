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
    var nodes = [];
    var accounts = [];
    var graph = [];
    this.apiService.getGraphData(words).subscribe((data: []) => {
      var n = data.length;
      var pi = Math.PI;
      var r = 4;
      for (var i = 0; i < n; i++) {
        var cuenta1 = data[i]['cuenta1'];
        var cuenta2 = data[i]['cuenta2'];
        var x1 = (Math.sin(i / (n+1) * 2 * pi) * r + 10);
        var y1 = (Math.cos(i / (n+1) * 2 * pi) * r + 10);
        var x2 = (Math.sin((i + 1) / (n+1) * 2 * pi) * r + 10);
        var y2 = (Math.cos((i + 1) / (n+1) * 2 * pi) * r + 10);
        if (!accounts.includes(cuenta1)) {
          let obj = {
            data: [
              { x: x1, y: y1, r: 10 }
            ],
            label: cuenta1,
            type: "bubble",
            backgroundColor: this.barChartColors[i]['backgroundColor']
          };
          nodes.push(obj);
          graph.push(obj);
        }
        
        if (!accounts.includes(cuenta2)) {
          let obj = {
            data: [
              { x: x2, y: y2, r: 10 }
            ],
            label: cuenta2,
            type: "bubble",
            backgroundColor: this.barChartColors[i+1]['backgroundColor']
          };
          nodes.push(obj);
          graph.push(obj);
        }
        var start = nodes[i]['data'][0];
        var end = nodes[i + 1]['data'][0];
        let obj = {
          data: [
            { x: start['x'], y: start['y'] },
            { x: end['x'], y: end['y'] }
          ],
          label: data[i]['palabra'],
          pointRadius: 0,
          type: "line",
          fill: false,
          borderColor: "grey"
        };
        graph.push(obj);
      }
    });

    this.scatterChartData.pop();
    this.scatterChartData = graph;
    var asdf = [{x:1}, {x:1}, {x:1}]
    console.log(nodes);
    console.log(graph);
  }

}
