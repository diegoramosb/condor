import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { path } from 'd3';
import { group } from '@angular/animations';

export interface GraphData {
  name: string;
  words: string[];
}

@Component({
  selector: 'app-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnChanges, AfterViewInit {

  @Input() graphData: GraphData[];

  @ViewChild('chart')
  private chartContainer: ElementRef;

  height = 500;

  width = 500;

  constructor() { }

  ngOnChanges(): void {
    if (!this.graphData) {
      return;
    }
    if (this.chartContainer != undefined) {
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  onResize() {
    this.createChart();
  }

  private createChart(): void {
    var element = this.chartContainer.nativeElement;

    var svg = d3.select(element)
      .append('svg')
      .attr("height", this.height)
      .attr("width", this.width)
      .style('background-color', 'yellow')

    var nodes = this.calculateNodes(this.calculateWordRadius(), this.calculateAccountRadius())
    var words = nodes[0];
    var accounts = nodes[1];

    var group = svg.append('g')
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)

    accounts.forEach(account => {
      group.append('circle')
        .attr('cx', account['x'])
        .attr('cy', account['y'])
        .attr('r', 2)
        .attr('fill', 'black')

      group.append('text')
        .attr('x', account['label']['x'])
        .attr('y', account['label']['y'])
        .attr('text-anchor', 'start')
        .attr('transform', `rotate(${account['label']['rot']} ${account['label']['x']} ${account['label']['y']})`)
        .text(account['label']['text'])
        .style('font-size', '1em')
    });

    words.forEach(word => {
      group.append('circle')
        .attr('cx', word['x'])
        .attr('cy', word['y'])
        .attr('r', 2)
        .attr('fill', 'black')

      group.append('text')
        .attr('x', word['label']['x'])
        .attr('y', word['label']['y'])
        .attr('text-anchor', 'start')
        .attr('transform', `rotate(${word['label']['rot']}, ${word['label']['x']}, ${word['label']['y']})`)
        .text(word['label']['text'])
        .style('font-size', '1em')
    })


    // var bezierCurve = (x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) => {
    //   var path = d3.path();
    //   path.moveTo(x1, y1);
    //   path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    //   return path.toString();
    // }

    // svg.append('path').attr('d', bezierCurve(100, 100, 100, 200, 200, 100, 200, 200)).attr('stroke', 'black').attr('fill', 'none');

    // var pathGenerator = (x1, y1, x2, y2, x3, y3) => {
    //   var path = d3.path()
    //   path.moveTo(x1, y1)
    //   path.lineTo(x2, y2)
    //   path.lineTo(x3, y3)
    //   path.closePath()
    //   return path.toString()
    // }
    // svg.append('path').attr('d', pathGenerator(25, 25, 75, 25, 200, 200))

    // var lineGenerator = d3.line<any>()
    // .x(function(d) {
    //   return d[0]
    // })
    // .y(function (d) {
    //   return d[1]
    // })

    // group.append("line")
    //   .attr("x1", 200)
    //   .attr("y1", 200)
    //   .attr("x2", 300)
    //   .attr("y2", 200)
    //   .style("stroke", "rgb(255,0,0)")
    //   .style("stroke-width", 2);
  }

  calculateWordRadius() {
    return 150;
  }

  calculateAccountRadius() {
    return this.calculateWordRadius() + 30;
    //encontrar palabra más larga y sumar x*número de letras de la palabra
  }

  calculateRotation(x, y) {
    var textRotation = 0;
    if(x > 0) {
      if(y >= 0) {
        textRotation = Math.atan2(y, x);
      }
      else {
        textRotation = Math.atan2(y, x) - Math.PI;
      }
    }
    else {
      if(y > 0) {
        textRotation = Math.atan2(y, x) - Math.PI;
      }
      else {
        textRotation = Math.atan2(y, x) - Math.PI;
      }
    }
    return textRotation * (360/(2*Math.PI));
  }

  calculateNodes(wordRadius: number, accountRadius: number) {
    var words = [];
    var accounts = [];
    var accountScale = d3.scaleLinear()
      .domain([0, this.graphData.length])
      .range([0, 2 * Math.PI]);

    var rotation = (accountScale(1) - accountScale(0))/2;
    for (var i = 0; i < this.graphData.length; i++) {
      var theta = accountScale(i) + rotation;
      var x = (accountRadius + 5) * Math.sin(theta);
      var y = (accountRadius + 5) * Math.cos(theta);
      
      var account = this.graphData[i];
      accounts.push(
        {
          'label': {
            'text': account.name,
            'x': x,
            'y': y,
            'rot': this.calculateRotation(x, y)
          },
          'x': accountRadius * Math.sin(theta),
          'y': accountRadius * Math.cos(theta)
        }
      );   
      
      if(account.words.length > 1) {
        var start = accountScale(i);
        var end = accountScale((i+1) % this.graphData.length) != 0 ? accountScale((i+1) % this.graphData.length) : 2 * Math.PI;
        var mid = (end - start)/2;
        var trueStart = start + 1.5*(mid/account.words.length);
        var trueEnd = end - 1.5*(mid/account.words.length);
        var increment = (trueEnd - trueStart)/(account.words.length - 1);

        for (var j = 0; j < account.words.length; j++) {
          var alpha = trueStart + j * increment;
          var x = (wordRadius + 5) * Math.sin(alpha);
          var y = (wordRadius + 5) * Math.cos(alpha);
          words.push(
            {
              'label': {
                'text': account.words[j],
                'x': x,
                'y': y,
                'rot': this.calculateRotation(x, y)
              },
              'x': wordRadius * Math.sin(alpha),
              'y': wordRadius * Math.cos(alpha)
            }
          );
        }
      }
      else if(account.words.length == 1) {
        words.push(
          {
            'label': {
              'text': account.words[0],
              'x': (wordRadius + 5) * Math.sin(theta),
              'y': (wordRadius + 5) * Math.cos(theta)
            },
            'x': wordRadius * Math.sin(theta),
            'y': wordRadius * Math.cos(theta)
          }
        );
      }
    }

    return [words, accounts];
  }
}
