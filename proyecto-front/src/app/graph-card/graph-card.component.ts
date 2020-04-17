import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input } from '@angular/core';
import { GraphDirective } from '../graph.directive'
import { GraphItem } from '../graph-item';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-graph-card',
  templateUrl: './graph-card.component.html',
  styleUrls: ['./graph-card.component.css']
})
export class GraphCardComponent implements OnInit {
  @Input() graph: GraphItem;
  public showing = true;
  public title = "asdf";

  @ViewChild(GraphDirective, {static:true}) graphHost: GraphDirective

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    // const graphItem = this.graph;
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(graphItem.component);

    // const viewContainerRef = this.graphHost.viewContainerRef;
    // viewContainerRef.clear();

    // const componentRef = viewContainerRef.createComponent(componentFactory);
    // (<>)
  }

}
