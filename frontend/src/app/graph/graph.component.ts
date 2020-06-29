import { Component, ElementRef, Input, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

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

export class GraphComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() graphData: GraphData[];

  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input() height: number;

  @Input() width: number;

  constructor() {
  }

  ngOnInit(): void {
    var data = JSON.parse(localStorage.getItem('graphData'));
    if(data != null) {
      this.graphData = data['graphData'];
    }
  }

  ngOnChanges(): void {
    if(this.chartContainer != undefined) {
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    if(this.graphData != undefined) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    if(localStorage.getItem('showingGraph') == 'true') {
      var json = {'graphData': this.graphData};
      localStorage.setItem('graphData', JSON.stringify(json));
    }
  }

  private createChart(): void {   
    var element = this.chartContainer.nativeElement;

    d3.select(element).selectAll('svg').remove();

    var svg = d3.select(element)
      .append('svg')
      .attr("height", this.height)
      .attr("width", this.width)

    var nodes = this.calculateNodes()
    var words = nodes[0];
    var accounts = nodes[1];

    var group = svg.append('g')
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)

    accounts.forEach(account => {
      group.append('text')
        .attr('x', account['label']['x'])
        .attr('y', account['label']['y'])
        .attr('text-anchor', account['label']['anchor'])
        .attr('transform', `rotate(${account['label']['rot']} ${account['label']['x']} ${account['label']['y']})`)
        .text(account['label']['text'])
        .style('font-size', '1em')
        .style('fill', 'grey')
    });

    words.forEach(word => {
      group.append('text')
        .attr('class', 'word-' + word['label']['text'])
        .attr('x', word['label']['x'])
        .attr('y', word['label']['y'])
        .attr('text-anchor', word['label']['anchor'])
        .attr('transform', `rotate(${word['label']['rot']}, ${word['label']['x']}, ${word['label']['y']})`)
        .text(word['label']['text'])
        .style('font-size', '1em')
        .style('fill', 'grey')
    })

    var quadraticCurve = (x1, y1, x2, y2) => {
      var path = d3.path();
      path.moveTo(x1, y1);
      path.quadraticCurveTo(0, 0, x2, y2);
      return path.toString();
    }

    for (var i = 0; i < words.length; i++) {
      var x1 = words[i]['x'];
      var y1 = words[i]['y'];

      for (var j = 0; j < words.length; j++) {
        var x2 = words[j]['x'];
        var y2 = words[j]['y'];
        if (i != j && words[i]['label']['text'] == words[j]['label']['text']) {
          group.append('path')
            .attr('class', "word-" + words[i]['label']['text'])
            .attr('d', quadraticCurve(x1, y1, x2, y2))
            .attr('stroke', 'grey')
            .attr('stroke-width', '0.2em')
            .attr('fill', 'none')
        }
      }
    }

    var hoverColor = d3.rgb(29, 161, 243)
    
    svg.selectAll('path')
      .on('mouseover', () => {
        var c = d3.select(d3.event.currentTarget).attr('class');
        var selection = d3.selectAll("." + c.toString());
        selection.filter(d3.matcher('text')).style('fill', hoverColor.toString());
        selection.filter(d3.matcher('path')).attr('stroke', hoverColor.toString());
      })
      .on('mouseout', () => {
        var c = d3.select(d3.event.currentTarget).attr('class');
        var selection = d3.selectAll("." + c.toString());
        selection.filter(d3.matcher('text')).style('fill', 'grey');
        selection.filter(d3.matcher('path')).attr('stroke', 'grey');
      })
    
    svg.selectAll('text')
    .on('mouseover', () => {
      var c = d3.select(d3.event.currentTarget).attr('class');
      if(c != null) {
        var selection = d3.selectAll("." + c.toString());
        selection.filter(d3.matcher('text')).style('fill', hoverColor.toString());
        selection.filter(d3.matcher('path')).attr('stroke', hoverColor.toString());
      }
    })
    .on('mouseout', () => {
      var c = d3.select(d3.event.currentTarget).attr('class');
      if(c != null) {
        var selection = d3.selectAll("." + c.toString());
        selection.filter(d3.matcher('text')).style('fill', 'grey');
        selection.filter(d3.matcher('path')).attr('stroke', 'grey');
      }
    })
   }

  calculateWordRadius(words) {
    var longestWord = ""
    words.forEach(word => {
      if (word.length > longestWord.length) {
        longestWord = word;
      }
    });
    var min = Math.min(this.height, this.width);
    return this.calculateAccountRadius() - longestWord.length * min/100;
  }

  calculateAccountRadius() {
    return this.height/3;
  }

  calculateRotation(x, y) {
    var textRotation = 0;
    if (x > 0) {
      if (y >= 0) {
        textRotation = Math.atan2(y, x);
      }
      else {
        textRotation = Math.atan2(y, x);
      }
    }
    else {
      if (y > 0) {
        textRotation = Math.atan2(y, x) - Math.PI;
      }
      else {
        textRotation = Math.atan2(y, x) - Math.PI;
      }
    }
    return textRotation * (360 / (2 * Math.PI));
  }

  calculateAnchor(x, y) {
    if (x > 0) {
      if (y >= 0) {
        return "start"
      }
      else {
        return "start"
      }
    }
    else {
      if (y > 0) {
        return "end"
      }
      else {
        return "end"
      }
    }
  }

  calculateNodes() {
    var words = [];
    var accounts = [];
    var accountScale = d3.scaleLinear()
      .domain([0, this.graphData.length])
      .range([0, 2 * Math.PI]);

    var rotation = (accountScale(1) - accountScale(0)) / 2;
    var allWords = [];
    this.graphData.forEach(account => {
      account.words.forEach(word => {
        allWords.push(word);
      })
    });
    var wordRadius = this.calculateWordRadius(allWords);
    var accountRadius = this.calculateAccountRadius();

    for (var i = 0; i < this.graphData.length; i++) {
      var account = this.graphData[i];

      var theta = accountScale(i) + rotation;
      var xAccount = (accountRadius + 5) * Math.sin(theta);
      var yAccount = (accountRadius + 5) * Math.cos(theta);

      var start = accountScale(i);
      var end = accountScale((i + 1) % this.graphData.length) != 0 ? accountScale((i + 1) % this.graphData.length) : 2 * Math.PI;
      var mid = (end - start) / 2;
      var trueStart = start + 1.8 * (mid / account.words.length);
      var trueEnd = end - 1.8 * (mid / account.words.length);
      var increment = (trueEnd - trueStart) / (account.words.length - 1);

      if (account.words.length > 1) {
        for (var j = 0; j < account.words.length; j++) {
          var alpha = trueStart + j * increment;
          var xWord = (wordRadius + 5) * Math.sin(alpha);
          var yWord = (wordRadius + 5) * Math.cos(alpha);
          words.push(
            {
              'label': {
                'text': account.words[j],
                'x': xWord,
                'y': yWord,
                'rot': this.calculateRotation(xWord, yWord),
                'anchor': this.calculateAnchor(xWord, yWord)
              },
              'x': wordRadius * Math.sin(alpha),
              'y': wordRadius * Math.cos(alpha)
            }
          );
        }
      }
      else if (account.words.length == 1) {
        var xWord = (wordRadius + 5) * Math.sin(theta);
        var yWord = (wordRadius + 5) * Math.cos(theta);
        words.push(
          {
            'label': {
              'text': account.words[0],
              'x': xWord,
              'y': yWord,
              'rot': this.calculateRotation(xWord, yWord),
              'anchor': this.calculateAnchor(xWord, yWord)
            },
            'x': wordRadius * Math.sin(theta),
            'y': wordRadius * Math.cos(theta)
          }
        );
      }

      accounts.push(
        {
          'label': {
            'text': account.name,
            'x': xAccount,
            'y': yAccount,
            'rot': this.calculateRotation(xAccount, yAccount),
            'anchor': this.calculateAnchor(xAccount, yAccount)
          },
          'x': accountRadius * Math.sin(theta),
          'y': accountRadius * Math.cos(theta)
        }
      );
    }

    return [words, accounts];
  }
}
