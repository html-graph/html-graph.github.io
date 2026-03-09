---
title: Usage with Angular
---

## Usage with Angular

HTMLGraph can be used with any frontend framework.
The common scenario is when you want node component to be reactive, thus be
managed by the framework itself.

Check out the <a href="https://html-graph.github.io/html-graph-angular-demo/" target="_blank"> angular live demo</a>
and the <a href="https://github.com/html-graph/html-graph-angular-demo/" target="_blank">angular demo source code</a>

This is a minimal working example of an angular node component:


<div data-tabs>
<div data-tabs-btns>
  <button data-tab="0" data-tab-active>
    graph-node.ts
  </button>

  <button data-tab="1">
    graph-node.html
  </button>

  <button data-tab="2">
    graph-node.css
  </button>
</div>

<div data-tab-content="0" data-tab-content-visible>
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
  readonly viewInitialized = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.viewInitialized.emit();
  }
}
{{< /code >}}
</div>

<div data-tab-content="1">
{{< code lang="html" >}}
<div #portIn></div>

<div class="name">
  {{ name }}
</div>

<div #portOut></div>
{{< /code >}}
</div>

<div data-tab-content="2">
{{< code lang="css" >}}
:host {
  display: flex;
  align-items: center;
  min-width: 250px;
  min-height: 50px;
  user-select: none;
  background: #daedbd;
  padding: 0.5rem;
}

.name {
  flex-grow: 1;
}
{{< /code >}}
</div>
</div>

It is recommended for you to implement an adapter such as this, to have an API
suitable for your application:

{{< code lang="typescript" >}}
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
  Injector,
  inputBinding,
  outputBinding,
  ViewRef,
} from '@angular/core';
import { Canvas, CanvasBuilder, Identifier } from '@html-graph/html-graph';
import { GraphNode } from './graph-node'; // Your Angular component for a node

@Injectable()
export class CanvasAdapter {
  private canvas!: Canvas;

  private readonly appRef = inject(ApplicationRef);

  private readonly injector = inject(Injector);

  private readonly viewRefs = new Map<Identifier, ViewRef>();

  init(element: HTMLElement): void {
    this.canvas = new CanvasBuilder(element).build();
  }

  addNode(id: Identifier): void {
    const nodeElement = document.createElement('div');
    const nodeComponent = createComponent(GraphNode, {
      environmentInjector: this.appRef.injector,
      hostElement: nodeElement,
      elementInjector: this.injector,
      bindings: [
        inputBinding('nodeId', () => id),
        inputBinding('name', () => `Node ${id}`),
        outputBinding('viewInitialized', () => {
          // Node must be updated manually on ngAfterViewInit lifecycle event trigger
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

  clear(): void {
    this.canvas.clear();
    this.reset();
  }

  destroy(): void {
    this.reset();
    this.canvas.destroy();
  }

  private reset(): void {
    this.viewRefs.forEach((viewRef) => {
      viewRef.destroy();
    });

    this.viewRefs.clear();
  }
}
{{< /code >}}
