---
title: Usage with Angular
---

## Usage with Angular

HTMLGraph can be used with any frontend framework. The primary use-case is when you want components within the graph to be managed by the framework itself.

If you're working with Angular, here's an example of creating a reactive component node:

{{< code lang="typescript" >}}
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
  Injector,
  inputBinding,
  ViewRef,
} from '@angular/core';
import { Canvas, CanvasBuilder, Identifier } from '@html-graph/html-graph';
import { GraphNode } from './graph-node'; // Your custom Angular component for a node

@Injectable()
export class HtmlGraphAdapter {
  private canvas!: Canvas;

  private readonly appRef = inject(ApplicationRef);

  private readonly injector = inject(Injector);

  private readonly viewRefs = new Map<Identifier, ViewRef>();

  init(element: HTMLElement): void {
    this.canvas = new CanvasBuilder(element).build();
  }

  destroy(): void {
    this.canvas.destroy();
  }

  addNode(id: Identifier): void {
    const nodeElement = document.createElement('div');
    const nodeComponent = createComponent(GraphNode, {
      environmentInjector: this.appRef.injector,
      hostElement: nodeElement,
      elementInjector: this.injector,
      bindings: [
        inputBinding('id', () => id),
        inputBinding('name', () => `Node ${id}`),
        outputBinding('initialized', () => {
          // Node must be updated manually after ngAfterViewInit lifecycle event triggers
          this.canvas.updateNode(id);
          // Alternatively, you could opt-in to Node Resize Reactive Edges feature
        }),
      ],
    });

    const { hostView, instance } = nodeComponent;

    // Makes the node component reactive
    this.appRef.attachView(hostView);
    this.viewRefs.set(id, hostView);

    this.canvas.addNode({
      id,
      element: nodeElement,
      x: 100,
      y: 200,
      ports: [
        { id: `port-${id}-in`, element: instance.portIn.nativeElement },
        { id: `port-${id}-out`, element: instance.portOut.nativeElement },
      ],
    });
  }

  removeNode(nodeId: Identifier): void {
    const hostView = this.viewRefs.get(nodeId)!;
    this.viewRefs.delete(nodeId);

    this.canvas.removeNode(nodeId);
    hostView.destroy();
  }
}
{{< /code >}}

Here's the corresponding Angular component implementation:

{{< code lang="typescript" >}}
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-graph-node',
  templateUrl: './graph-node.html',
  styleUrls: ['./graph-node.less'],
})
export class GraphNode implements AfterViewInit {
  @ViewChild('portIn', { static: true })
  portIn!: ElementRef;

  @ViewChild('portOut', { static: true })
  portOut!: ElementRef;

  @Input({ required: true })
  nodeId: number;

  @Input({ required: true })
  name!: string;

  @Output()
  readonly initialized = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.initialized.emit();
  }
}
{{< /code >}}

For more details, check out the <a href="https://github.com/html-graph/html-graph-angular-demo/" target="_blank">full source code</a>
and the <a href="https://html-graph.github.io/html-graph-angular-demo/" target="_blank">live demo</a>.
