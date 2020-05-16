import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core'; import * as d3 from 'd3';
import { path } from 'd3';


@Component({
  selector: 'app-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges, AfterViewInit {

  @Input() graphData;

  @ViewChild('chart')
  private chartContainer: ElementRef;

  margin = { top: 50, right: 20, bottom: 30, left: 100 };

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
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;

    var arcs = [
      { startAngle: 0, endAngle: 0.2 },
      { startAngle: 0.2, endAngle: 0.6 },
      { startAngle: 0.6, endAngle: 1.4 },
      { startAngle: 1.4, endAngle: 3 },
      { startAngle: 3, endAngle: 2 * Math.PI }
    ]

    var points = [
      [0, 80],
      [100, 100],
      [200, 30],
      [300, 50],
      [400, 40],
      [500, 80]
    ];

    var pathData = (points) => {
      return d3.line()
        .curve(d3.curveCardinal)(points);
    }

    var arcGenerator = d3.arc()
      .innerRadius(80)
      .outerRadius(100)
      .padAngle(.02)
      .padRadius(100);


    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arcGenerator);

    // g.select('path')
    //   .attr('d', pathData(points));

    g.append('path')
      .attr('d', pathData(points));


    d3.select('svg')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return d[0];
      })
      .attr('cy', function (d) {
        return d[1];
      })
      .attr('r', 3);

    // const x = d3
    //   .scaleBand()
    //   .rangeRound([0, contentWidth])
    //   .padding(0.1)
    //   .domain(data.map(d => d.letter));

    // const y = d3
    //   .scaleLinear()
    //   .rangeRound([contentHeight, 0])
    //   .domain([0, d3.max(data, d => d.frequency)]);


    // g.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', 'translate(0,' + contentHeight + ')')
    //   .call(d3.axisBottom(x));

    // g.append('g')
    //   .attr('class', 'axis axis--y')
    //   .call(d3.axisLeft(y).ticks(10, '%'))
    //   .append('text')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', 6)
    //   .attr('dy', '0.71em')
    //   .attr('text-anchor', 'end')
    //   .text('Frequency');

    // g.selectAll('.bar')
    //   .data(data)
    //   .enter().append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', d => x(d.letter))
    //   .attr('y', d => y(d.frequency))
    //   .attr('width', x.bandwidth())
    //   .attr('height', d => contentHeight - y(d.frequency));
  }
}
